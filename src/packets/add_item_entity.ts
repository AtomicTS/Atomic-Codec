import { ItemStack } from "./inventory_transaction";

export interface AddItemEntityPacket {
  uniqueId: bigint;
  runtimeId: bigint;
  item?: ItemStack;
  position?: { x: number; y: number; z: number; };
  velocity?: { x: number; y: number; z: number; };
  data?: any;
  isFromFishing?: boolean;
}
