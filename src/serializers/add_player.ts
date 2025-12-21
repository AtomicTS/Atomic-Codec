import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AddPlayerPacket } from "../packets/add_player";
import { PacketSerializer } from "../PacketSerializer";
import { AbilityLayer } from "../types/AbilityLayer";
import { DataItem } from "../types/DataItem";
import { EntityLinkSet } from "../types/EntityLinkSet";
import { PropertySyncData } from "../types/PropertySyncData";
import { Vector3 } from "../types/Vector3";
import { readItem } from "./shared_items";

export class AddPlayerSerializer implements PacketSerializer<AddPlayerPacket> {
  encode(buf: BufferWriter, p: AddPlayerPacket) {
    buf.writeUuid(p.uuid);
    buf.writeString(p.username);
    buf.writeVarLong(p.runtimeId);
    buf.writeString(p.platform_chat_id ?? "");
    buf.writeFloatLE(p.position.x);
    buf.writeFloatLE(p.position.y);
    buf.writeFloatLE(p.position.z);
    buf.writeFloatLE(p.velocity.x);
    buf.writeFloatLE(p.velocity.y);
    buf.writeFloatLE(p.velocity.z);
    buf.writeFloatLE(p.pitch);
    buf.writeFloatLE(p.yaw);
    buf.writeFloatLE(p.headYaw);
  }

  decode(buf: BufferReader): AddPlayerPacket {
    const uuid = buf.readUuid();
    const username = buf.readString();
    const runtimeId = buf.readVarLong();
    const platform_chat_id = buf.readString();
    const position = Vector3.read(buf);
    const velocity = Vector3.read(buf);
    const pitch = buf.readFloatLE();
    const yaw = buf.readFloatLE();
    const headYaw = buf.readFloatLE();
    const heldItem = readItem(buf);
    const gamemode = buf.readZigZag();
    const data = DataItem.read(buf);
    const properties = PropertySyncData.read(buf);
    const uniqueEntityId = buf.readInt64LE();
    const permissionLevel = buf.readVarInt();
    const commandPermission = buf.readVarInt();
    const abilities = AbilityLayer.read(buf);
    const links = EntityLinkSet.read(buf);
    const deviceId = buf.readString();
    const deviceOS = buf.readInt32LE();

    return {
      uuid,
      username,
      runtimeId,
      platform_chat_id,
      position,
      velocity,
      pitch,
      yaw,
      headYaw,
      heldItem,
      gamemode,
      data,
      properties,
      uniqueEntityId,
      abilities,
      commandPermission,
      deviceId,
      deviceOS,
      links,
      permissionLevel
    };
  }
}
