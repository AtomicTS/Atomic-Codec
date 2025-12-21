import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { BlockEntityDataPacket } from "../packets/block_entity_data";
import { PacketSerializer } from "../PacketSerializer";
import { BlockLocation } from "../types/BlockLocation";

export class BlockEntityDataSerializer implements PacketSerializer<BlockEntityDataPacket> {
  encode(buf: BufferWriter, p: BlockEntityDataPacket) {
    BlockLocation.write(buf, p.position);
  }

  decode(buf: BufferReader): BlockEntityDataPacket {
    const position = BlockLocation.read(buf);
    /**
     * TODO:
     * Implement NBT Decoding Method
     */
    const nbt = {};

    return { nbt, position };
  }
}