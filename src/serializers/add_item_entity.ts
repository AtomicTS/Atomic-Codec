import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AddItemEntityPacket } from "../packets/add_item_entity";
import { PacketSerializer } from "../PacketSerializer";
import { DataItem } from "../types/DataItem";
import { readItem, writeItem } from "./shared_items";

function readVec3(buf: BufferReader) {
  return { x: buf.readFloatLE(), y: buf.readFloatLE(), z: buf.readFloatLE() };
}

export class AddItemEntitySerializer implements PacketSerializer<AddItemEntityPacket> {
  encode(buf: BufferWriter, p: AddItemEntityPacket) {
    buf.writeZigZag64(p.uniqueId);
    buf.writeVarInt64(p.runtimeId);
    if (p.item) writeItem(buf, p.item);
    else buf.writeZigZag32(0);
    const pos = p.position ?? { x: 0, y: 0, z: 0 };
    buf.writeFloatLE(pos.x);
    buf.writeFloatLE(pos.y);
    buf.writeFloatLE(pos.z);
    const vel = p.velocity ?? { x: 0, y: 0, z: 0 };
    buf.writeFloatLE(vel.x);
    buf.writeFloatLE(vel.y);
    buf.writeFloatLE(vel.z);

    const meta = p.data ?? Buffer.from([0xff]);
    buf.writeBuffer(meta);

    buf.writeBool(p.isFromFishing ?? false);
  }

  decode(buf: BufferReader): AddItemEntityPacket {
    const uniqueId = buf.readZigZong();
    const runtimeId = buf.readVarLong();
    const item = readItem(buf);
    const position = readVec3(buf);
    const velocity = readVec3(buf);
    const data = DataItem.read(buf);
    const isFromFishing = buf.readBool();

    return {
      runtimeId,
      uniqueId,
      item,
      velocity,
      position,
      data,
      isFromFishing
    };
  }
}
