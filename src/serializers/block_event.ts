import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { BlockEventType } from "../enums/BlockEventType";
import { BlockEventPacket } from "../packets/block_event";
import { PacketSerializer } from "../PacketSerializer";
import { BlockLocation } from "../types/BlockLocation";

export class BlockEventSerializer implements PacketSerializer<BlockEventPacket> {
  encode(buf: BufferWriter, p: BlockEventPacket) {

  }

  decode(buf: BufferReader): BlockEventPacket {
    const position = BlockLocation.read(buf);
    const type = BlockEventType[buf.readZigZag()];
    const data = buf.readZigZag();

    return { data, position, type };
  }
}
