import { Packet } from "../Packet";

export class CommandOutputPacket extends Packet {
  id = 79;
  origin!: string;
  uuid!: string;
  requestId!: string;
  playerUniqueId!: bigint;
  outputType!: string;
  successCount!: number;
  messages!: any[];
  data!: string;
}