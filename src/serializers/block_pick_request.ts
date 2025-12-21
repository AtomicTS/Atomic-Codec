import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { BlockPickRequestPacket } from "../packets/block_pick_request";
import { PacketSerializer } from "../PacketSerializer";

export class BlockPickRequestSerializer implements PacketSerializer<BlockPickRequestPacket> {
  encode(buf: BufferWriter, p: BlockPickRequestPacket) {

  }

  decode(buf: BufferReader): BlockPickRequestPacket {
    const x = buf.readZigZag();
    const y = buf.readZigZag();
    const z = buf.readZigZag();
    const addData = buf.readBool();
    const selectedSlot = buf.readUInt8();

    return { addData, selectedSlot, x, y, z };
  }
}
