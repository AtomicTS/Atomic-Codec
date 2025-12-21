import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AvailableCommandsPacket } from "../packets/available_commands";
import { PacketSerializer } from "../PacketSerializer";

export class AvailableCommandsSerializer implements PacketSerializer<AvailableCommandsPacket> {
  encode(buf: BufferWriter, p: AvailableCommandsPacket) {

  }
  decode(buf: BufferReader): AvailableCommandsPacket {
    return {
      enum_values: [],
      suffixes: [],
      enums: [],
      commands: [],
      soft_enums: [],
      constraints: [],
    };
  }
}
