import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { Options } from "./Options";

export class CommandBlockEntityRuntimeId {
    public static read(
        buf: BufferReader,
        options?: Options<boolean>
    ): bigint | null {
        if (options?.parameter === true) return null;
        return buf.readVarLong();
    }

    public static write(
        buf: BufferWriter,
        value: bigint,
        options?: Options<boolean>
    ): void {
        if (options?.parameter === false) return;
        buf.writeVarLong(value);
    }
}