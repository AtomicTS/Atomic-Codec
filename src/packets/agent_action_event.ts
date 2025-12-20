import { AgentActionType } from "../enums/AgentActionType";

export interface AgentActionEventPacket {
    requestId: string;
    action: AgentActionType;
    response: string;
}