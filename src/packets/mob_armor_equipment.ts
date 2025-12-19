import { ItemStack } from "./inventory_transaction";

export interface MobArmorEquipmentPacket {
  runtimeId: bigint;
  helmet: ItemStack;
  chestplate: ItemStack;
  leggings: ItemStack;
  boots: ItemStack;
  body?: ItemStack;
}
