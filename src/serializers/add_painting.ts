import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AddPaintingPacket } from "../packets/add_painting";
import { PacketSerializer } from "../PacketSerializer";

function readVec3(buf: BufferReader) {
  return { x: buf.readFloatLE(), y: buf.readFloatLE(), z: buf.readFloatLE() };
}

export class AddPaintingSerializer implements PacketSerializer<AddPaintingPacket> {
  encode(buf: BufferWriter, p: AddPaintingPacket) {
    buf.writeZigZong(p.uniqueId);
    buf.writeZigZong(p.runtimeId);
    buf.writeFloatLE(p.position.x);
    buf.writeFloatLE(p.position.y);
    buf.writeFloatLE(p.position.z);
    buf.writeZigZag(p.direction);
    buf.writeString(p.name);
  }

  decode(buf: BufferReader): AddPaintingPacket {
    const uniqueId = buf.readZigZong();
    const runtimeId = buf.readZigZong();
    const position = readVec3(buf);
    const direction = buf.readZigZag();
    const name = buf.readString();
    return { uniqueId, runtimeId, position, direction, name };
  }
}
