import { AddItemEntityPacket } from "../packets/add_item_entity";
import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { PacketSerializer } from "../PacketSerializer";
import { readItem, writeItem } from "./shared_items";

function readVec3(buf: BufferReader) {
  return { x: buf.readFloatLE(), y: buf.readFloatLE(), z: buf.readFloatLE() };
}

export class AddItemEntitySerializer implements PacketSerializer<AddItemEntityPacket> {
  encode(buf: BufferWriter, p: AddItemEntityPacket) {
    buf.writeZigZag64(p.entity_id_self);
    buf.writeVarInt64(p.runtime_entity_id);
    if (p.item) writeItem(buf, p.item);
    else buf.writeZigZag32(0);
    const pos = p.position ?? { x: 0, y: 0, z: 0 };
    buf.writeFloatLE(pos.x);
    buf.writeFloatLE(pos.y);
    buf.writeFloatLE(pos.z);
    const vel = p.motion ?? { x: 0, y: 0, z: 0 };
    buf.writeFloatLE(vel.x);
    buf.writeFloatLE(vel.y);
    buf.writeFloatLE(vel.z);
    // Metadata dictionary (terminated with 0xff sentinel)
    const meta = p.metadata_raw ?? Buffer.from([0xff]);
    buf.writeBuffer(meta);
    // Is from fishing
    buf.writeBool(p.from_fishing ?? false);
  }

  decode(buf: BufferReader): AddItemEntityPacket {
    const entity_id_self = buf.readZigZag64();
    const runtime_entity_id = buf.readVarInt64();
    const item = readItem(buf);
    const position = readVec3(buf);
    const motion = readVec3(buf);

    // Remaining bytes are metadata dictionary + bool flag.
    const remainingLen = buf.remaining();
    let metadata_raw: Buffer = Buffer.from([0xff]);
    let from_fishing = false;
    if (remainingLen > 0) {
      const remaining = buf.readBytes(remainingLen);
      const sentinelIndex = remaining.indexOf(0xff);
      if (sentinelIndex !== -1) {
        const metaEnd = sentinelIndex + 1;
        metadata_raw = remaining.subarray(0, metaEnd) as Buffer;
        if (remaining.length > metaEnd) {
          from_fishing = !!remaining[metaEnd];
        }
      } else {
        // If no sentinel found, keep the raw bytes and default the flag.
        metadata_raw = remaining as Buffer;
      }
    }

    return { entity_id_self, runtime_entity_id, item, position, motion, metadata_raw, from_fishing };
  }
}
