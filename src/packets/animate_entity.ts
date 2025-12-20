export interface AnimateEntityPacket {
  animation: string;
  nextState: string;
  stopExpression: string;
  stopExpressionversion: number;
  controller: string;
  blendOutTime: number;
  entityRuntimeIds: Array<bigint>;
}
