import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { BossEventColor } from "../enums/BossEventColor";
import { BossEventUpdateType } from "../enums/BossEventUpdateType";
import { Options } from "./Options";

export class BossEventAdd {
    public readonly title: string;
    public readonly percent: number;
    public readonly darkenScreen: number;
    public readonly color: BossEventColor;
    public readonly overlay: number;

    public constructor(
        title: string,
        percent: number,
        darkenScreen: number,
        color: BossEventColor,
        overlay: number
    ) {
        this.title = title;
        this.percent = percent;
        this.darkenScreen = darkenScreen;
        this.color = color;
        this.overlay = overlay;
    };

    public static read(
        buf: BufferReader,
        options?: Options<BossEventUpdateType>
    ): BossEventAdd | null {
        if (options?.parameter === BossEventUpdateType.Add) {
            const name = buf.readString();
            buf.readString(); //Filtered Name

            const percent = buf.readFloatLE();
            const darkenScreen = buf.readInt16LE();
            const color = buf.readVarInt();
            const overlay = buf.readVarInt();

            return new BossEventAdd(name, percent, darkenScreen, color, overlay);
        } else {
            return null;
        }
    }

    public static write(
        buf: BufferWriter,
        value: BossEventAdd,
        options?: Options<BossEventUpdateType>
    ): void {
        if (options?.parameter === BossEventUpdateType.Add) {
            buf.writeString(value.title);
            buf.writeString(value.title); //Filtered Name
            buf.writeFloatLE(value.percent);
            buf.writeInt16LE(value.percent);
            buf.writeVarInt(value.color);
            buf.writeVarInt(value.overlay);
        }
    }
}