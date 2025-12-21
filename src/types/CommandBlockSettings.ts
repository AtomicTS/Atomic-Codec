import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { CommandBlockMode } from "../enums/CommandBlockMode";
import { BlockLocation } from "./BlockLocation";
import { Options } from "./Options";

export class CommandBlockSettings {
    public readonly position: BlockLocation;
    public readonly commandMode: CommandBlockMode;
    public readonly redstoneMode: boolean;
    public readonly conditionalMode: boolean;

    public constructor(
        position: BlockLocation,
        commandMode: CommandBlockMode,
        redstoneMode: boolean,
        conditionalMode: boolean
    ) {
        this.position = position;
        this.commandMode = commandMode;
        this.redstoneMode = redstoneMode;
        this.conditionalMode = conditionalMode;
    }

    public static read(
        buf: BufferReader,
        options?: Options<boolean>
    ): CommandBlockSettings | null {
        if (options?.parameter === false) return null;

        const position = BlockLocation.read(buf);
        const commandMode = buf.readVarInt();
        const redstoneMode = buf.readBool();
        const conditionalMode = buf.readBool();

        return new CommandBlockSettings(position, commandMode, redstoneMode, conditionalMode);
    }

    public static write(
        buf: BufferWriter,
        value: CommandBlockSettings,
        options?: Options<boolean>
    ): void {
        if (options?.parameter === false) return;

        BlockLocation.write(buf, value.position);
        buf.writeVarInt(value.commandMode);
        buf.writeBool(value.redstoneMode);
        buf.writeBool(value.conditionalMode);
    }
}