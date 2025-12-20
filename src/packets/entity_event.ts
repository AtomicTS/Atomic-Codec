export type EntityEventId = number | string;

export interface EntityEventPacket {
  entityRuntimeId: bigint;
  event: EntityEventId;
  data: number;
}
