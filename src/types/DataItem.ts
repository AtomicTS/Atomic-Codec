import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { EntityDataId } from "../enums/EntityDataId";
import { EntityDataType } from "../enums/EntityDataType";
import { TagType } from "../enums/TagType";
import { BlockLocation } from "./BlockLocation";
import { NBT } from "./NBT";
import { Vector3 } from "./Vector3";

export class DataItem<T = unknown> {
    public readonly identifier: EntityDataId;
    public readonly type: EntityDataType;
    public value: T;

    public constructor(identifier: EntityDataId, type: EntityDataType, value: T) {
        this.identifier = identifier;
        this.type = type;
        this.value = value;
    }

    public static read(buf: BufferReader): Array<DataItem> {
        const items: Array<DataItem> = [];
        const amount = buf.readVarInt();

        for (let i = 0; i < amount; i++) {
            const identifier = buf.readVarInt();
            const type = buf.readVarInt();

            let value: unknown = null;
            switch (type) {
                case EntityDataType.Byte: {
                    value = buf.readInt8();
                    break;
                }
                case EntityDataType.Short: {
                    value = buf.readInt16LE();
                    break;
                }
                case EntityDataType.Int: {
                    value = buf.readZigZag();
                    break;
                }
                case EntityDataType.Float: {
                    value = buf.readFloatLE();
                    break;
                }
                case EntityDataType.String: {
                    value = buf.readString();
                    break;
                }
                case EntityDataType.CompoundTag: {
                    const rootType = buf.readInt8();
                    if (rootType === TagType.End) {
                        value = {};
                    } else {
                        const rootName = buf.readString();
                        value = NBT.readTagPayload(buf, rootType);
                    }
                    break;
                }
                case EntityDataType.BlockPos: {
                    const x = buf.readZigZag();
                    let y = buf.readVarInt(); //Mojank
                    const z = buf.readZigZag();

                    y = 4_294_967_295 - 64 >= y ? y : y - 4_294_967_296;

                    value = { x, y, z };
                    break;
                }
                case EntityDataType.Long: {
                    value = buf.readZigZong();
                    break;
                }
                case EntityDataType.Vec3: {
                    const x = buf.readFloatLE();
                    const y = buf.readFloatLE();
                    const z = buf.readFloatLE();

                    value = { x, y, z };
                    break;
                }
            }

            items.push(new DataItem(identifier, type, value));
        }

        return items;
    }

    public static write(buf: BufferWriter, data: Array<DataItem>): void {
        buf.writeVarInt(data.length);

        for (const item of data) {
            buf.writeVarInt(item.identifier);
            buf.writeVarInt(item.type);

            switch (item.type) {
                case EntityDataType.Byte: {
                    buf.writeInt8(item.value as number);
                    break;
                }
                case EntityDataType.Short: {
                    buf.writeInt16LE(item.value as number);
                    break;
                }
                case EntityDataType.Int: {
                    buf.writeZigZag(item.value as number);
                    break;
                }
                case EntityDataType.Float: {
                    buf.writeFloatLE(item.value as number);
                    break;
                }
                case EntityDataType.String: {
                    buf.writeString(item.value as string);
                    break;
                }
                case EntityDataType.CompoundTag: {
                    buf.writeInt8(TagType.Compound);
                    buf.writeString(""); // Root name is usually empty in EntityMetadata
                    NBT.writeTagPayload(buf, TagType.Compound, item.value);
                    break;
                }
                case EntityDataType.BlockPos: {
                    BlockLocation.write(buf, item.value as BlockLocation);
                    break;
                }
                case EntityDataType.Long: {
                    buf.writeZigZong(item.value as bigint);
                    break;
                }
                case EntityDataType.Vec3: {
                    Vector3.write(buf, item.value as Vector3);
                    break;
                }
            }
        }
    }
}