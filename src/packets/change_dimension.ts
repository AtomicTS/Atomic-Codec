export interface ChangeDimensionPacket {
  dimension: string;
  position: { x: number; y: number; z: number; };
  respawn: boolean;
  hasLoadingScreen?: boolean | null;
}
