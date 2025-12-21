import { BlockCoordinates } from "./update_block";

export interface BlockEventPacket {
  position: BlockCoordinates;
  type: string;
  data: number;
}
