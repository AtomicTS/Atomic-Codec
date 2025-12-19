import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { TextCategory, TextPacket, TextType } from "../packets/text";
import { PacketSerializer } from "../PacketSerializer";

const TYPES: TextType[] = [
  "raw",
  "chat",
  "translation",
  "popup",
  "jukebox_popup",
  "tip",
  "system",
  "whisper",
  "announcement",
  "json_whisper",
  "json",
  "json_announcement",
];

const CATEGORIES: TextCategory[] = ["message_only", "author_and_message", "message_and_params"];

export class TextSerializer implements PacketSerializer<TextPacket> {
  encode(buf: BufferWriter, p: TextPacket) {
    const categoryIndex = typeof p.category === "number" ? p.category : CATEGORIES.indexOf(p.category ?? "message_only");
    const typeIndex = typeof p.type === "number" ? p.type : TYPES.indexOf(p.type);

    buf.writeBool(!!p.isLocalized);
    buf.writeUInt8(categoryIndex);

    switch (categoryIndex) {
      case 0: // message_only
        buf.writeString("raw");
        buf.writeString("tip");
        buf.writeString("systemMessage");
        buf.writeString("textObjectWhisper");
        buf.writeString("textObjectAnnouncement");
        buf.writeString("textObject");
        buf.writeUInt8(typeIndex);
        buf.writeString(p.message ?? "");
        break;
      case 1: // author_and_message
        buf.writeString("chat");
        buf.writeString("whisper");
        buf.writeString("announcement");
        buf.writeUInt8(typeIndex);
        buf.writeString(p.source_name ?? "");
        buf.writeString(p.message ?? "");
        break;
      case 2: // message_and_params
      default:
        buf.writeString("translation");
        buf.writeString("popup");
        buf.writeString("jukeboxPopup");
        buf.writeUInt8(typeIndex);
        buf.writeString(p.message ?? "");
        buf.writeVarInt(p.parameters?.length ?? 0);
        for (const param of p.parameters ?? []) buf.writeString(param);
        break;
    }

    buf.writeString(p.xuid ?? "");
    buf.writeString(p.platform_chat_id ?? "");
    if (p.filtered_message !== undefined) {
      buf.writeBool(true);
      // buf.writeString(p.filtered_message);
    } else {
      buf.writeBool(false);
    }
  }

  decode(buf: BufferReader): TextPacket {
    const isLocalized = buf.readBool();
    const categoryIndex = buf.readUInt8();
    const category = CATEGORIES[categoryIndex] ?? categoryIndex;

    let typeIndex = 0;
    let type: TextType | number = 0;
    let message = "";
    let parameters: string[] | undefined;
    let source_name: string | undefined;

    switch (categoryIndex) {
      case 0: {
        for (let i = 0; i < 6; i++) buf.readString();

        typeIndex = buf.readUInt8();
        message = buf.readString();
        break;
      }
      case 1: {
        for (let i = 0; i < 3; i++) buf.readString();

        typeIndex = buf.readUInt8();
        source_name = buf.readString();
        message = buf.readString();
        break;
      }
      case 2:
      default: {
        for (let i = 0; i < 3; i++) buf.readString();

        typeIndex = buf.readUInt8();
        message = buf.readString();
        parameters = [];

        const bufParams = buf.readVarInt();
        for (let i = 0; i < bufParams; i++) parameters.push(buf.readString());
        break;
      }
    }

    type = TYPES[typeIndex] ?? typeIndex;
    const xuid = buf.readString();
    const platform_chat_id = buf.readString();
    const filtered_message = buf.readString();

    return {
      category,
      type,
      isLocalized,
      source_name,
      message,
      parameters,
      xuid,
      platform_chat_id,
      filtered_message
    };
  }
}