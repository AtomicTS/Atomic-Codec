import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { MoveEntityDelta } from "../packets/move_entity_delta";
import { PacketSerializer } from "../PacketSerializer";

function rotation(value: number) {
    value = value / (360 / 256);
    if (value < -128) value = -128;
    else if (value > 127) value = 127;
    return value;
}

export class MoveEntityDeltaSerializer implements PacketSerializer<MoveEntityDelta> {
    encode(buf: BufferWriter, p: MoveEntityDelta): void {
        buf.writeVarLong(p.runtimeId);
        buf.writeUInt8(p.flags);
        buf.writeFloatLE(p.x);
        buf.writeFloatLE(p.y);
        buf.writeFloatLE(p.z);
        buf.writeInt8(rotation(p.pitch));
        buf.writeInt8(rotation(p.yaw));
        buf.writeInt8(rotation(p.headYaw));
    }

    decode(buf: BufferReader): MoveEntityDelta {
        const runtimeId = buf.readVarLong();
        const flags = buf.readUInt16LE();
        const x = buf.readFloatLE();
        const y = buf.readFloatLE();
        const z = buf.readFloatLE();
        const pitch = buf.readInt8() * (360 / 256);
        const yaw = buf.readInt8() * (360 / 256);
        const headYaw = buf.readInt8() * (360 / 256);

        return { runtimeId, flags, headYaw, pitch, x, y, z, yaw };
    }
}