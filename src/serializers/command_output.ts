import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { CommandOutputPacket } from "../packets/command_output";
import { PacketSerializer } from "../PacketSerializer";

export class CommandOutputSerializer implements PacketSerializer<CommandOutputPacket> {
  encode(buf: BufferWriter, p: CommandOutputPacket) {
    buf.writeString(p.origin);
    buf.writeUuid(p.uuid);
    buf.writeString(p.requestId);
    buf.writeInt64LE(p.playerUniqueId);

    buf.writeString(p.outputType);
    buf.writeUInt32LE(p.successCount);
  }
  decode(buf: BufferReader): CommandOutputPacket {
    const p = new CommandOutputPacket();

    p.origin = buf.readString();
    p.uuid = buf.readUuid();
    p.requestId = buf.readString();
    p.playerUniqueId = buf.readInt64LE();

    p.outputType = buf.readString();
    p.successCount = buf.readInt32LE();

    const messageCount = buf.readVarInt();
    p.messages = [];

    for (let i = 0; i < messageCount; i++) {
      p.messages.push({
        messageId: buf.readString(),
        internal: buf.readBool(),
        parameters: buf.readArray(() => buf.readString())
      });
    }

    if (buf.remaining() > 0) {
      p.data = buf.readString(); // optional
    }

    return p;
  }
}
