export interface AvailableCommandsPacket {
  enum_values: string[];
  suffixes: string[];
  enums: { name: string; values: number[]; }[];
  commands: {
    name: string;
    description: string;
    unknown_flags: number;
    command_flags: number;
    permission: number;
    alias_enum_index: number;
    chained_subcommand_offsets: number[];
    overloads: {
      chaining: boolean;
      parameters: {
        name: string;
        type: number;
        optional: boolean;
        options: number;
        enum_index?: number;
        soft_enum_index?: number;
        postfix_index?: number;
      }[];
    }[];
  }[];
  soft_enums: { name: string; values: string[]; }[];
  constraints: { value_index: number; enum_index: number; param_indices: number[]; }[];
  raw?: Buffer;
}
