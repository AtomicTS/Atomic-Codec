import { ServerboundLoadingScreenPacket } from "../packets/serverbound_loading_screen";
import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { PacketSerializer } from "../PacketSerializer";

export class ServerboundLoadingScreenSerializer implements PacketSerializer<ServerboundLoadingScreenPacket> {
  encode(buf: BufferWriter, p: ServerboundLoadingScreenPacket) {
    buf.writeZigZag32(p.type);
    if (p.loading_screen_id !== undefined && p.loading_screen_id !== null) {
      buf.writeBool(true);
      buf.writeUInt32LE(p.loading_screen_id);
    } else {
      buf.writeBool(false);
    }
  }

  decode(buf: BufferReader): ServerboundLoadingScreenPacket {
    const type = buf.readZigZag32();
    const hasLoadingId = buf.readBool();
    const loading_screen_id = hasLoadingId ? buf.readUInt32LE() : undefined;
    return { type, loading_screen_id };
  }
}
