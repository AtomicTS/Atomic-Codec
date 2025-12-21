import { BossEventAdd } from "../types/BossEventAdd";
import { BossEventUpdate } from "../types/BossEventUpdate";

export interface BossEventPacket {
  targetUniqueId: bigint;
  type: number;
  add: BossEventAdd | null;
  update: BossEventUpdate | null;
}
