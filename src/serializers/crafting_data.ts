import { CraftingDataPacket } from "../packets/crafting_data";
import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { PacketSerializer } from "../PacketSerializer";

export class CraftingDataSerializer implements PacketSerializer<CraftingDataPacket> {
  encode(buf: BufferWriter, p: CraftingDataPacket) {
    if (!p.raw) {
      throw new Error("CraftingDataSerializer encode requires raw payload");
    }
    buf.writeBuffer(p.raw);
  }

  decode(buf: BufferReader): CraftingDataPacket {
    const raw = buf.readBytes(buf.remaining());
    const clear_recipes = raw.length ? raw[raw.length - 1] !== 0 : false;
    return {
      recipes: [],
      potion_type_recipes: [],
      potion_container_recipes: [],
      material_reducers: [],
      clear_recipes,
      raw,
    };
  }
}
