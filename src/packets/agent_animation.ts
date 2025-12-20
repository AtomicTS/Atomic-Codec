import { AgentAnimationId } from "../enums/AgentAnimationId";

export interface AgentAnimationPacket {
    agentAnimation: AgentAnimationId;
    entityRuntimeId: bigint;
}