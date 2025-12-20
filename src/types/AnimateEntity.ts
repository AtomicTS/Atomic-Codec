import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";

export class AnimateEntity {
    public static read(buf: BufferReader): Array<bigint> {
        const runtimeIds: Array<bigint> = [];
        const amount = buf.readVarInt();

        for (let i = 0; i < amount; i++) {
            runtimeIds.push(buf.readVarLong());
        }

        return runtimeIds;
    }

    public static write(buf: BufferWriter, value: Array<bigint>): void {
        buf.writeVarInt(value.length);

        for (const runtimeId of value) {
            buf.writeVarLong(runtimeId);
        }
    }
}