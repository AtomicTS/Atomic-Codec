import { DeathParameters } from "../types/DeathParameters";

export interface DeathInfoPacket {
  cause: string;
  messages: DeathParameters[];
}
