import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { TextPacket } from "../packets/text";
import { PacketSerializer } from "../PacketSerializer";

export const TEXT_TYPE_MAP: Record<number, string> = {
  0: "raw",
  1: "chat",
  2: "translation",
  3: "popup",
  4: "jukebox_popup",
  5: "tip",
  6: "system",
  7: "whisper",
  8: "announcement",
  9: "json_whisper",
  10: "json",
  11: "json_announcement"
};

export const TEXT_TYPE_INV: Record<string, number> = {};
for (const [k, v] of Object.entries(TEXT_TYPE_MAP)) {
  TEXT_TYPE_INV[v] = parseInt(k);
}

export const TEXT_CATEGORY_MAP: Record<number, string> = {
  0: "message_only",
  1: "author_and_message",
  2: "message_and_params"
};

export const TEXT_CATEGORY_INV: Record<string, number> = {
  message_only: 0,
  author_and_message: 1,
  message_and_params: 2
};

export class TextSerializer implements PacketSerializer<TextPacket> {
  encode(buf: BufferWriter, p: TextPacket) {
    //Translation
    buf.writeBool(p.needs_translation);

    //Category
    let catId = 0;
    if (typeof p.category === "string") {
      catId = TEXT_CATEGORY_INV[p.category] ?? 0;
    } else {
      catId = p.category ?? 0;
    }
    buf.writeUInt8(catId);

    //Switch on Category
    switch (catId) {
      case 0: // message_only
        buf.writeString(p.name_raw ?? "");
        buf.writeString(p.name_tip ?? "");
        buf.writeString(p.name_system ?? "");
        buf.writeString(p.name_object_whisper ?? "");
        buf.writeString(p.name_object_announcement ?? "");
        buf.writeString(p.name_object ?? "");

        this.writeType(buf, p.type);
        buf.writeString(p.message);
        break;

      case 1: // author_and_message
        buf.writeString(p.name_chat ?? "");
        buf.writeString(p.name_whisper ?? "");
        buf.writeString(p.name_announcement ?? "");

        this.writeType(buf, p.type);
        buf.writeString(p.source_name ?? "");
        buf.writeString(p.message);
        break;

      case 2: // message_and_params
        buf.writeString(p.name_translate ?? "");
        buf.writeString(p.name_popup ?? "");
        buf.writeString(p.name_jukebox_popup ?? "");

        this.writeType(buf, p.type);
        buf.writeString(p.message);

        // Array of strings (parameters)
        const params = p.parameters ?? [];
        buf.writeVarInt(params.length);
        for (const param of params) {
          buf.writeString(param);
        }
        break;

      default:
        break;
    }

    buf.writeString(p.xuid ?? "");
    buf.writeString(p.platform_chat_id ?? "");
    if (p.filtered_message !== undefined) {
      buf.writeBool(true);
      buf.writeString(p.filtered_message);
    } else {
      buf.writeBool(false);
    }
  }

  decode(buf: BufferReader): TextPacket {
    const needs_translation = buf.readBool();

    const catId = buf.readUInt8();
    const category = TEXT_CATEGORY_MAP[catId] ?? catId;

    let p: Partial<TextPacket> = { needs_translation, category };

    switch (catId) {
      case 0: // message_only
        p.name_raw = buf.readString();
        p.name_tip = buf.readString();
        p.name_system = buf.readString();
        p.name_object_whisper = buf.readString();
        p.name_object_announcement = buf.readString();
        p.name_object = buf.readString();

        p.type = this.readType(buf);
        p.message = buf.readString();
        break;

      case 1: // author_and_message
        p.name_chat = buf.readString();
        p.name_whisper = buf.readString();
        p.name_announcement = buf.readString();

        p.type = this.readType(buf);
        p.source_name = buf.readString();
        p.message = buf.readString();
        break;

      case 2: // message_and_params
        p.name_translate = buf.readString();
        p.name_popup = buf.readString();
        p.name_jukebox_popup = buf.readString();

        p.type = this.readType(buf);
        p.message = buf.readString();

        const paramCount = buf.readVarInt();
        const parameters: string[] = [];
        for (let i = 0; i < paramCount; i++) {
          parameters.push(buf.readString());
        }
        p.parameters = parameters;
        break;
    }

    p.xuid = buf.readString();
    p.platform_chat_id = buf.readString();

    const hasFiltered = buf.readBool();
    if (hasFiltered) {
      p.filtered_message = buf.readString();
    }

    return p as TextPacket;
  }

  private writeType(buf: BufferWriter, type: number | string) {
    let typeId = 0;
    if (typeof type === "string") {
      // FIX: Default to 0 ('raw') if empty string to prevent "Found: ''" error
      if (type === "") typeId = 0;
      else typeId = TEXT_TYPE_INV[type] ?? 0;
    } else {
      typeId = type ?? 0;
    }
    buf.writeUInt8(typeId);
  }

  private readType(buf: BufferReader): string | number {
    const typeId = buf.readUInt8();
    return TEXT_TYPE_MAP[typeId] ?? typeId;
  }
}
