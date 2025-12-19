import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { MobArmorEquipmentPacket } from "../packets/mob_armor_equipment";
import { PacketSerializer } from "../PacketSerializer";
import { readItem, writeItem } from "./shared_items";

export class MobArmorEquipmentSerializer implements PacketSerializer<MobArmorEquipmentPacket> {
  encode(buf: BufferWriter, p: MobArmorEquipmentPacket) {
    buf.writeVarInt64(p.runtimeId);
    writeItem(buf, p.helmet);
    writeItem(buf, p.chestplate);
    writeItem(buf, p.leggings);
    writeItem(buf, p.boots);
    writeItem(buf, p.body ?? {} as any);
  }

  decode(buf: BufferReader): MobArmorEquipmentPacket {
    const runtimeId = buf.readVarInt64();
    const helmet = readItem(buf);
    const chestplate = readItem(buf);
    const leggings = readItem(buf);
    const boots = readItem(buf);
    const body = readItem(buf);
    return { runtimeId, helmet, chestplate, leggings, boots, body };
  }
}
