import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { TagType } from "../enums/TagType";

export class NBT {
    static readTagPayload(buf: BufferReader, type: TagType): any {
        switch (type) {
            case TagType.Byte: return buf.readInt8();
            case TagType.Short: return buf.readInt16LE();
            case TagType.Int: return buf.readZigZag(); // Network NBT uses VarInt (ZigZag) for Int
            case TagType.Long: return buf.readZigZong(); // Network NBT uses VarLong (ZigZag) for Long
            case TagType.Float: return buf.readFloatLE();
            case TagType.Double: return buf.readDoubleLE(); // Requires readDoubleLE in BufferReader
            case TagType.ByteList: {
                const len = buf.readVarInt(); // Network NBT uses VarInt for length
                return buf.readBytes(len);
            }
            case TagType.String: return buf.readString(); // readString uses VarInt length
            case TagType.List: {
                const itemType = buf.readInt8();
                const len = buf.readVarInt(); // Network NBT uses VarInt for length
                const list = [];
                for (let i = 0; i < len; i++) {
                    list.push(this.readTagPayload(buf, itemType));
                }
                return list;
            }
            case TagType.Compound: {
                const compound: any = {};
                while (true) {
                    const nextType = buf.readInt8();
                    if (nextType === TagType.End) break;
                    const name = buf.readString(); // Network NBT uses VarInt length for name
                    compound[name] = this.readTagPayload(buf, nextType);
                }
                return compound;
            }
            // Add IntList/LongList if needed (using VarInt lengths)
            default: return null;
        }
    }

    static writeTagPayload(buf: BufferWriter, type: TagType, value: any): void {
        switch (type) {
            case TagType.Byte: buf.writeInt8(value); break;
            case TagType.Short: buf.writeInt16LE(value); break;
            case TagType.Int: buf.writeZigZag(value); break;
            case TagType.Long: buf.writeZigZong(value); break;
            case TagType.Float: buf.writeFloatLE(value); break;
            case TagType.Double: buf.writeDoubleLE(value); break; // Requires writeDoubleLE in BufferWriter
            case TagType.String: buf.writeString(value); break;
            case TagType.Compound: {
                for (const key in value) {
                    const val = value[key];
                    const tagType = this.guessType(val);
                    if (tagType === null) continue;

                    buf.writeInt8(tagType);
                    buf.writeString(key);
                    this.writeTagPayload(buf, tagType, val);
                }
                buf.writeInt8(TagType.End);
                break;
            }
            case TagType.List: {
                // Heuristic: Check first element to determine list type
                if (!Array.isArray(value)) return;
                const len = value.length;
                const subType = len > 0 ? this.guessType(value[0]) : TagType.Byte; // Default to Byte if empty

                buf.writeInt8(subType!);
                buf.writeVarInt(len);
                for (const item of value) {
                    this.writeTagPayload(buf, subType!, item);
                }
                break;
            }
            // ByteList, IntList logic would go here if you use typed arrays
        }
    }

    static guessType(value: any): TagType | null {
        if (typeof value === 'number') {
            return Number.isInteger(value) ? TagType.Int : TagType.Float;
        }
        if (typeof value === 'string') return TagType.String;
        if (typeof value === 'boolean') return TagType.Byte; // NBT uses Byte 1/0 for boolean
        if (typeof value === 'bigint') return TagType.Long;
        if (typeof value === 'object') {
            if (Array.isArray(value)) return TagType.List;
            if (value === null) return null;
            return TagType.Compound;
        }
        return null;
    }
}