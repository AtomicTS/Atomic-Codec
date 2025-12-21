import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { CommandBlockUpdatePacket } from "../packets/command_block_update";
import { PacketSerializer } from "../PacketSerializer";
import { CommandBlockEntityRuntimeId } from "../types/CommandBlockEntityRuntimeId";
import { CommandBlockSettings } from "../types/CommandBlockSettings";

export class CommandBlockUpdateSerializer implements PacketSerializer<CommandBlockUpdatePacket> {
  encode(buf: BufferWriter, p: CommandBlockUpdatePacket) {
    buf.writeBool(p.isBlock);
    CommandBlockEntityRuntimeId.write(buf, p.entityRuntimeId!, { parameter: p.isBlock });
    CommandBlockSettings.write(buf, p.settings!, { parameter: p.isBlock });
    buf.writeString(p.command);
    buf.writeString(p.lastOutput);
    buf.writeString(p.customName);
    buf.writeString(p.filteredName);
    buf.writeBool(p.trackOutput);
    buf.writeUInt32LE(p.tickDelay);
    buf.writeBool(p.executeFirstTick);
  }
  
  decode(buf: BufferReader): CommandBlockUpdatePacket {
    const isBlock = buf.readBool();
    const entityRuntimeId = CommandBlockEntityRuntimeId.read(buf, { parameter: isBlock });
    const settings = CommandBlockSettings.read(buf, { parameter: isBlock });
    const command = buf.readString();
    const lastOutput = buf.readString();
    const customName = buf.readString();
    const filteredName = buf.readString();
    const trackOutput = buf.readBool();
    const tickDelay = buf.readUInt32LE();
    const executeFirstTick = buf.readBool();

    return {
      command,
      customName,
      entityRuntimeId,
      executeFirstTick,
      filteredName,
      isBlock,
      lastOutput,
      settings,
      tickDelay,
      trackOutput
    };
  }
}
