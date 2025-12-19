export enum AnimateType {
  NoAction,
  SwingArm,
  WakeUp,
  CriticalHit,
  MagicCriticalHit
}

export enum AnimateSwingSourceType {
  None = "None",
  Build = "Build",
  Mine = "Mine",
  Interact = "Interact",
  Attack = "Attack",
  UseItem = "UseItem",
  ThrowItem = "ThrowItem",
  DropItem = "DropItem",
  Event = "Event"
}

export interface AnimatePacket {
  type: AnimateType;
  actorRuntimeId: bigint;
  data: number;
  swingSourceType: AnimateSwingSourceType;
}
