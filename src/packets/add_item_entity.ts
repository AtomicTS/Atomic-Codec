export interface AddItemEntityPacket {
  entity_id_self: bigint;
  runtime_entity_id: bigint;
  item?: {
    network_id: number;
    count?: number;
    metadata?: number;
    block_runtime_id?: number;
    extra?: Buffer;
  };
  position?: { x: number; y: number; z: number; };
  motion?: { x: number; y: number; z: number; };
  from_fishing?: boolean;
  metadata_raw?: Buffer; // Raw entity metadata dictionary (terminated with 0xff)
  raw?: Buffer;
}
