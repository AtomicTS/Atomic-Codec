import { CommandBlockSettings } from "../types/CommandBlockSettings";

export interface CommandBlockUpdatePacket {
  isBlock: boolean;
  entityRuntimeId: bigint | null;
  settings: CommandBlockSettings | null;
  command: string;
  lastOutput: string;
  customName: string;
  filteredName: string;
  trackOutput: boolean;
  tickDelay: number;
  executeFirstTick: boolean;
}
