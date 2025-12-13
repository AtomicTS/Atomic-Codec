import { BlockCoordinates } from "./update_block";

export interface BlockEntityDataPacket {
  position: BlockCoordinates;
  nbt: any; // Parsed NBT payload
  nbt_raw?: Buffer; // Raw NBT buffer (little-endian)
}
