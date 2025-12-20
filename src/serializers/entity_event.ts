import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { EntityEventPacket } from "../packets/entity_event";
import { PacketSerializer } from "../PacketSerializer";

export class EntityEventSerializer implements PacketSerializer<EntityEventPacket> {
  encode(buf: BufferWriter, p: EntityEventPacket) {
    buf.writeVarLong(p.entityRuntimeId);
    buf.writeUInt8(typeof p.event === "number" ? p.event : 0);
    buf.writeZigZag(p.data);
  }

  decode(buf: BufferReader): EntityEventPacket {
    const entityRuntimeId = buf.readVarLong();
    const event = buf.readUInt8();
    const data = buf.readZigZag();
    return { entityRuntimeId, event, data };
  }
}
