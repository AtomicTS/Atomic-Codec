import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AnimateEntityPacket } from "../packets/animate_entity";
import { PacketSerializer } from "../PacketSerializer";
import { AnimateEntity } from "../types/AnimateEntity";

export class AnimateEntitySerializer implements PacketSerializer<AnimateEntityPacket> {
    encode(buf: BufferWriter, packet: AnimateEntityPacket): void {
        buf.writeString(packet.animation);
        buf.writeString(packet.nextState);
        buf.writeString(packet.stopExpression);
        buf.writeInt32LE(packet.stopExpressionversion);
        buf.writeString(packet.controller);
        buf.writeFloatLE(packet.blendOutTime);
        AnimateEntity.write(buf, packet.entityRuntimeIds);
    }

    decode(buf: BufferReader): AnimateEntityPacket {
        const animation = buf.readString();
        const nextState = buf.readString();
        const stopExpression = buf.readString();
        const stopExpressionversion = buf.readInt32LE();
        const controller = buf.readString();
        const blendOutTime = buf.readFloatLE();
        const entityRuntimeIds = AnimateEntity.read(buf);

        return { animation, blendOutTime, controller, entityRuntimeIds, nextState, stopExpression, stopExpressionversion };
    }
}