import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AgentAnimationPacket } from "../packets/agent_animation";
import { PacketSerializer } from "../PacketSerializer";

export class AgentAnimationSerializer implements PacketSerializer<AgentAnimationPacket> {
    encode(buf: BufferWriter, packet: AgentAnimationPacket): void {
        buf.writeUInt8(packet.agentAnimation);
        buf.writeZigZong(packet.entityRuntimeId);
    }

    decode(buf: BufferReader): AgentAnimationPacket {
        const agentAnimation = buf.readUInt8();
        const entityRuntimeId = buf.readZigZong();

        return { agentAnimation, entityRuntimeId };
    }
}