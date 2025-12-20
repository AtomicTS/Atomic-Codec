export interface AddPaintingPacket {
  uniqueId: bigint;
  runtimeId: bigint;
  position: { x: number; y: number; z: number; };
  direction: number;
  name: string;
}
