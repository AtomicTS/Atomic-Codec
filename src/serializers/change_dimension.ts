import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { PacketSerializer } from "../PacketSerializer";
import { DimensionType } from "../enums/DimensionType";
import { ChangeDimensionPacket } from "../packets/change_dimension";
import { Vector3 } from "../types/Vector3";

export class ChangeDimensionSerializer implements PacketSerializer<ChangeDimensionPacket> {
  encode(buf: BufferWriter, p: ChangeDimensionPacket) {
    buf.writeZigZag(Object.values(DimensionType).indexOf(p.dimension));
    Vector3.write(buf, p.position);
    buf.writeBool(p.respawn);
    buf.writeBool(p.hasLoadingScreen ?? false);
  }

  decode(buf: BufferReader): ChangeDimensionPacket {
    const dimension = DimensionType[buf.readZigZag()];
    const position = Vector3.read(buf);
    const respawn = buf.readBool();
    const hasLoadingScreen = buf.readBool();

    return { dimension, position, respawn, hasLoadingScreen };
  }
}
