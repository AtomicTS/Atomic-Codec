export interface TextPacket {
  needs_translation: boolean;
  /** * Category: 0 (message_only), 1 (author_and_message), 2 (message_and_params) */
  category: number | string;
  type: number | string;
  message: string;
  name_raw?: string;
  name_tip?: string;
  name_system?: string;
  name_object_whisper?: string;
  name_object_announcement?: string;
  name_object?: string;
  name_chat?: string;
  name_whisper?: string;
  name_announcement?: string;
  source_name?: string;
  name_translate?: string;
  name_popup?: string;
  name_jukebox_popup?: string;
  parameters?: string[];
  xuid: string;
  platform_chat_id: string;
  filtered_message?: string;
}