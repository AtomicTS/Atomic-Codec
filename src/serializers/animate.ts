import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AnimatePacket, AnimateSwingSourceType } from "../packets/animate";
import { PacketSerializer } from "../PacketSerializer";

export class AnimateSerializer implements PacketSerializer<AnimatePacket> {
  encode(buf: BufferWriter, p: AnimatePacket) {
    buf.writeUInt8(p.type);
    buf.writeVarLong(p.actorRuntimeId);
    buf.writeFloatLE(p.data);
    buf.writeString(p.swingSourceType);
  }

  decode(buf: BufferReader): AnimatePacket {
    const type = buf.readUInt8();
    const actorRuntimeId = buf.readVarLong();
    const data = buf.readFloatLE();
    const swingSourceType = buf.readString() as AnimateSwingSourceType;

    return { type, actorRuntimeId, data, swingSourceType };
  }
}
