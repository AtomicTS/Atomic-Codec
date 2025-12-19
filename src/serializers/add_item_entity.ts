import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AddItemEntityPacket } from "../packets/add_item_entity";
import { PacketSerializer } from "../PacketSerializer";
import { readItem, writeItem } from "./shared_items";

function readVec3(buf: BufferReader) {
  return { x: buf.readFloatLE(), y: buf.readFloatLE(), z: buf.readFloatLE() };
}

enum ActorDataType {
  Byte,
  Short,
  Int,
  Float,
  String,
  CompoundTag,
  BlockPos,
  Long,
  Vec3
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

    const items: any[] = [];
    const amount = buf.readVarInt();

    for (let i = 0; i < amount; i++) {
      const identifier = buf.readVarInt();
      const type = buf.readVarInt();

      let value: unknown = null;
      switch (type) {
        case ActorDataType.Byte: {
          value = buf.readInt8();
          break;
        }
        case ActorDataType.Short: {
          value = buf.readInt16LE();
          break;
        }
        case ActorDataType.Int: {
          value = buf.readZigZag();
          break;
        }
        case ActorDataType.Float: {
          value = buf.readFloatLE();
          break;
        }
        case ActorDataType.String: {
          value = buf.readString();
          break;
        };
        case ActorDataType.CompoundTag: {
          break;
        };
        case ActorDataType.BlockPos: {
          const x = buf.readZigZag();
          let y = buf.readVarInt(); //Mojank
          const z = buf.readZigZag();

          y = 4_294_967_295 - 64 >= y ? y : y - 4_294_967_296;

          value = { x, y, z };
          break;
        };
        case ActorDataType.Long: {
          value = buf.readZigZong();
          break;
        }
        case ActorDataType.Vec3: {
          const x = buf.readFloatLE();
          const y = buf.readFloatLE();
          const z = buf.readFloatLE();

          value = { x, y, z };
          break;
        }
      }

      items.push({ identifier, type, value });
    }

    const isFromFishing = buf.readBool();

    return {
      runtimeId,
      uniqueId,
      item,
      velocity,
      position,
      data: items,
      isFromFishing
    };
  }
}
