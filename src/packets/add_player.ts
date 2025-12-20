import { ItemStack } from "./inventory_transaction";

export enum Gamemode {
  Survival,
  Creative,
  Adventure,
  SurvivalSpectator,
  CreativeSpectator,
  Fallback,
  Spectator
}

export enum PermissionLevel {
  Visitor,
  Member,
  Operator
}

export enum DeviceOS {
  Undefined,
  Android,
  Ios,
  MacOS,
  FireOS,
  GearVR,
  Hololens,
  Win10,
  Win32,
  Dedicated,
  TVOS,
  Orbis,
  Switch,
  Xbox,
  WindowsPhone,
  Linux
}

export interface AddPlayerPacket {
  uuid: string;
  username: string;
  runtimeId: bigint;
  platform_chat_id: string;
  position: { x: number; y: number; z: number; };
  velocity: { x: number; y: number; z: number; };
  pitch: number;
  yaw: number;
  headYaw: number;
  heldItem: ItemStack;
  gamemode: Gamemode;
  data: any;
  properties: any;
  uniqueEntityId: bigint;
  permissionLevel: PermissionLevel;
  commandPermission: number;
  abilities: any;
  links: any;
  deviceId: string;
  deviceOS: DeviceOS;
}
