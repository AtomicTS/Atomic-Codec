import { ItemStack } from "./inventory_transaction";

export interface AddItemEntityPacket {
  uniqueId: bigint;
  runtimeId: bigint;
  item?: ItemStack;
  position?: { x: number; y: number; z: number; };
  motion?: { x: number; y: number; z: number; };
  from_fishing?: boolean;
  metadata_raw?: Buffer; // Raw entity metadata dictionary (terminated with 0xff)
  raw?: Buffer;
}
