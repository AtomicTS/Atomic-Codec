import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";

export class DeathParameters {
    public message: string;

    public constructor(message: string) {
        this.message = message;
    }

    public static read(buf: BufferReader): Array<DeathParameters> {
        const entries: Array<DeathParameters> = [];
        const amount = buf.readVarInt();

        for (let i = 0; i < amount; i++) {
            const message = buf.readString();
            entries.push(new DeathParameters(message));
        }

        return entries;
    }

    public static write(buf: BufferWriter, value: Array<DeathParameters>): void {
        buf.writeVarInt(value.length);

        for (const entry of value) {
            buf.writeString(entry.message);
        }
    }
}