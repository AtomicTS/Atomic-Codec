import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { CraftingDataPacket } from "../packets/crafting_data";
import { PacketSerializer } from "../PacketSerializer";

export class CraftingDataSerializer implements PacketSerializer<CraftingDataPacket> {
  encode(buf: BufferWriter, p: CraftingDataPacket) {

  }

  decode(buf: BufferReader): CraftingDataPacket {
    return {
      crafting: [],
      potions: [],
      containers: [],
      materialReducers: [],
      clearRecipes: false
    };
  }
}
