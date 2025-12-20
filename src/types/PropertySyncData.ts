import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";

interface Data {
    index: number;
    value: number;
}

export class PropertySyncData {
    public readonly floats: Array<Data>;
    public readonly ints: Array<Data>;

    public constructor(floats: Array<Data>, ints: Array<Data>) {
        this.floats = floats;
        this.ints = ints;
    }

    public static read(buf: BufferReader): PropertySyncData {
        const ints: Array<Data> = [];
        const iamount = buf.readVarInt();

        for (let i = 0; i < iamount; i++) {
            const index = buf.readVarInt();
            const value = buf.readZigZag();

            ints.push({ index, value });
        }

        const floats: Array<Data> = [];
        const famount = buf.readVarInt();

        for (let i = 0; i < famount; i++) {
            const index = buf.readVarInt();
            const value = buf.readFloatLE();

            floats.push({ index, value });
        }

        return new PropertySyncData(floats, ints);
    }

    public static write(buf: BufferWriter, value: PropertySyncData): void {
        buf.writeVarInt(value.ints.length);

        for (const int of value.ints) {
            buf.writeVarInt(int.index);
            buf.writeZigZag(int.value);
        }

        buf.writeVarInt(value.floats.length);

        for (const float of value.floats) {
            buf.writeVarInt(float.index);
            buf.writeFloatLE(float.value);
        }
    }
}