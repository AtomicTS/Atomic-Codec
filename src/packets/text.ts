export type TextType =
  | "raw"
  | "json_whisper"
  | "chat"
  | "translation"
  | "popup"
  | "jukebox_popup"
  | "tip"
  | "system"
  | "whisper"
  | "announcement"
  | "json_whisper"
  | "json"
  | "json_announcement";

export type TextCategory = "message_only" | "author_and_message" | "message_and_params" | number;

export interface TextPacket {
  category?: TextCategory;
  type: TextType | number;
  isLocalized: boolean;
  source_name?: string;
  message: string;
  parameters?: string[];
  xuid?: string;
  platform_chat_id?: string;
  filtered_message?: string;
}