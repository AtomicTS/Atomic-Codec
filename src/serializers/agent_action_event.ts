import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AgentActionEventPacket } from "../packets/agent_action_event";
import { PacketSerializer } from "../PacketSerializer";

export class AgentActionEventSerializer implements PacketSerializer<AgentActionEventPacket> {
    encode(buf: BufferWriter, p: AgentActionEventPacket): void {
        buf.writeString(p.requestId);
        buf.writeVarInt(p.action);
        buf.writeString(p.response);
    }

    decode(buf: BufferReader): AgentActionEventPacket {
        const requestId = buf.readString();
        const action = buf.readVarInt();
        const response = buf.readString();

        return { requestId, action, response };
    }
} 