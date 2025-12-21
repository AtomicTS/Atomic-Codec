import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { BossEventColor } from "../enums/BossEventColor";
import { BossEventUpdateType } from "../enums/BossEventUpdateType";
import { Options } from "./Options";

export class BossEventUpdate {
    public readonly playerUniqueId?: bigint | null;
    public readonly percent?: number | null;
    public readonly title?: string | null;
    public readonly darkenScreen?: number | null;
    public readonly color?: BossEventColor | null;
    public readonly overlay?: number | null;

    public constructor(
        playerUniqueId?: bigint | null,
        percent?: number | null,
        title?: string | null,
        darkenScreen?: number | null,
        color?: BossEventColor | null,
        overlay?: number | null
    ) {
        this.playerUniqueId = playerUniqueId;
        this.percent = percent;
        this.title = title;
        this.darkenScreen = darkenScreen;
        this.color = color;
        this.overlay = overlay;
    };

    public static read(
        buf: BufferReader,
        options?: Options<BossEventUpdateType>
    ): BossEventUpdate | null {
        switch (options?.parameter) {
            case BossEventUpdateType.Add:
            case BossEventUpdateType.Remove: {
                return null;
            }
            case BossEventUpdateType.PlayerAdded:
            case BossEventUpdateType.PlayerRemoved: {
                const playerUniqueId = buf.readZigZong();
                return new BossEventUpdate(playerUniqueId);
            }
            case BossEventUpdateType.UpdatePercent: {
                const percent = buf.readFloatLE();
                return new BossEventUpdate(null, percent);
            }
            case BossEventUpdateType.UpdateName: {
                const title = buf.readString();
                buf.readString(); //Filtered Name

                return new BossEventUpdate(null, null, title);
            }
            case BossEventUpdateType.UpdateProperties: {
                const darkenScreen = buf.readInt16LE();
                const color = buf.readVarInt();
                const overlay = buf.readVarInt();

                return new BossEventUpdate(null, null, null, darkenScreen, color, overlay);
            }
            case BossEventUpdateType.UpdateStyle: {
                const color = buf.readVarInt();
                const overlay = buf.readVarInt();

                return new BossEventUpdate(null, null, null, null, color, overlay);
            }
            case BossEventUpdateType.Query: {
                const playerUniqueId = buf.readZigZong();

                return new BossEventUpdate(playerUniqueId);
            }
        }

        return null;
    }

    public static write(
        buf: BufferWriter,
        value: BossEventUpdate,
        options?: Options<BossEventUpdateType>
    ): void {
        switch (options?.parameter) {
            case BossEventUpdateType.Add:
            case BossEventUpdateType.Remove: {
                break;
            }
            case BossEventUpdateType.PlayerAdded:
            case BossEventUpdateType.PlayerRemoved: {
                buf.writeZigZong(value.playerUniqueId ?? BigInt(0));
                break;
            }
            case BossEventUpdateType.UpdatePercent: {
                buf.writeFloatLE(value.percent ?? 0);
                break;
            }
            case BossEventUpdateType.UpdateName: {
                buf.writeString(value.title ?? String());
                buf.writeString(value.title ?? String()); //Filtered Name
                break;
            }
            case BossEventUpdateType.UpdateProperties: {
                buf.writeInt16LE(value.color ?? 0);
                buf.writeVarInt(value.color ?? 0);
                buf.writeVarInt(value.overlay ?? 0);
                break;
            }
            case BossEventUpdateType.UpdateStyle: {
                buf.writeVarInt(value.color ?? 0);
                buf.writeVarInt(value.overlay ?? 0);
                break;
            }
            case BossEventUpdateType.Query: {
                buf.writeZigZong(value.playerUniqueId ?? BigInt(0));
                break;
            }
        }
    }
}