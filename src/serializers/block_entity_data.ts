import { BlockEntityDataPacket } from "../packets/block_entity_data";
import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { PacketSerializer } from "../PacketSerializer";
import { parseUncompressed, simplify, writeUncompressed } from "prismarine-nbt";

function writeBlockCoords(buf: BufferWriter, pos: { x: number; y: number; z: number }) {
  buf.writeZigZag32(pos.x);
  buf.writeVarInt(pos.y);
  buf.writeZigZag32(pos.z);
}
function readBlockCoords(buf: BufferReader) {
  return { x: buf.readZigZag32(), y: buf.readVarInt(), z: buf.readZigZag32() };
}

export class BlockEntityDataSerializer implements PacketSerializer<BlockEntityDataPacket> {
  encode(buf: BufferWriter, p: BlockEntityDataPacket) {
    writeBlockCoords(buf, p.position);
    const rawNbt =
      p.nbt_raw ??
      (writeUncompressed(
        // Accept either a full NBT shape or simplify by wrapping the provided object.
        (p.nbt && (p.nbt as any).name !== undefined && (p.nbt as any).value !== undefined
          ? p.nbt
          : { name: "", value: p.nbt ?? {} }) as any,
        "little" as any,
      ) as any as Buffer);
    buf.writeBuffer(rawNbt);
  }

  decode(buf: BufferReader): BlockEntityDataPacket {
    const position = readBlockCoords(buf);
    const nbt_raw = buf.readBytes(buf.remaining());
    let nbt: any = {};
    if (nbt_raw.length) {
      try {
        const parsed = parseUncompressed(nbt_raw, "little");
        nbt = simplify(parsed);
      } catch {
        nbt = {};
      }
    }
    return { position, nbt, nbt_raw };
  }
}
