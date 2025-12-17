import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { MobEquipmentPacket } from "../packets/mob_equipment";
import { PacketSerializer } from "../PacketSerializer";
import { readItem, writeItem } from "./shared_items";

const WINDOW_ID_MAP: Record<number, string> = {
  0: "inventory",
  1: "first",
  100: "last",
  119: "offhand",
  120: "armor",
  121: "creative",
  122: "hotbar",
  123: "fixed_inventory",
  124: "ui",
  "-100": "drop_contents",
  "-24": "beacon",
  "-23": "trading_output",
  "-22": "trading_use_inputs",
  "-21": "trading_input_2",
  "-20": "trading_input_1",
  "-17": "enchant_output",
  "-16": "enchant_material",
  "-15": "enchant_input",
  "-13": "anvil_output",
  "-12": "anvil_result",
  "-11": "anvil_material",
  "-10": "container_input",
  "-5": "crafting_use_ingredient",
  "-4": "crafting_result",
  "-3": "crafting_remove_ingredient",
  "-2": "crafting_add_ingredient",
  "-1": "none"
};

const WINDOW_ID_INV: Record<string, number> = {};
for (const [k, v] of Object.entries(WINDOW_ID_MAP)) {
  WINDOW_ID_INV[v] = parseInt(k);
}

export class MobEquipmentSerializer implements PacketSerializer<MobEquipmentPacket> {
  encode(buf: BufferWriter, p: MobEquipmentPacket) {
    buf.writeVarInt64(p.runtime_entity_id);
    writeItem(buf, p.item);
    buf.writeUInt8(p.slot);
    buf.writeUInt8(p.selected_slot);

    let winId = 0;
    if (typeof p.window_id === "string") {
      winId = WINDOW_ID_INV[p.window_id] ?? 0;
    } else {
      winId = p.window_id ?? 0;
    }

    buf.writeUInt8(winId & 0xFF);
  }

  decode(buf: BufferReader): MobEquipmentPacket {
    const runtime_entity_id = buf.readVarInt64();
    const item = readItem(buf);
    const slot = buf.readUInt8();
    const selected_slot = buf.readUInt8();

    const rawWinId = buf.readUInt8();
    const signedWinId = rawWinId > 127 ? rawWinId - 256 : rawWinId;
    const window_id = WINDOW_ID_MAP[signedWinId] ?? signedWinId;

    return { runtime_entity_id, item, slot, selected_slot, window_id };
  }
}
