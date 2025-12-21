import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { DeathInfoPacket } from "../packets/death_info";
import { PacketSerializer } from "../PacketSerializer";
import { DeathParameters } from "../types/DeathParameters";

export class DeathInfoSerializer implements PacketSerializer<DeathInfoPacket> {
  encode(buf: BufferWriter, p: DeathInfoPacket) {
    buf.writeString(p.cause);
    DeathParameters.write(buf, p.messages);
  }

  decode(buf: BufferReader): DeathInfoPacket {
    const cause = buf.readString();
    const messages = DeathParameters.read(buf);

    return { cause, messages };
  }
}
