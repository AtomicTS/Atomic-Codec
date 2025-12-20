import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";

export enum EntityLinkType {
    Remove,
    Rider,
    Passenger
}

export class EntityLink {
    public riddenUniqueId: bigint;
    public riderUniqueId: bigint;
    public type: EntityLinkType;
    public immediate: boolean;
    public riderInitiated: boolean;
    public vehicleAngularVelocity: number;

    public constructor(
        riddenUniqueId: bigint,
        riderUniqueId: bigint,
        type: EntityLinkType,
        immediate: boolean,
        riderInitiated: boolean,
        vehicleAngularVelocity: number
    ) {
        this.riddenUniqueId = riddenUniqueId;
        this.riderUniqueId = riderUniqueId;
        this.type = type;
        this.immediate = immediate;
        this.riderInitiated = riderInitiated;
        this.vehicleAngularVelocity = vehicleAngularVelocity;
    }

    public static write(buf: BufferWriter, value: EntityLink) {
        buf.writeZigZong(value.riddenUniqueId);
        buf.writeZigZong(value.riderUniqueId);
        buf.writeUInt8(value.type);
        buf.writeBool(value.immediate);
        buf.writeBool(value.riderInitiated);
        buf.writeFloatLE(value.vehicleAngularVelocity);
    }

    public static read(buf: BufferReader): EntityLink {
        return new EntityLink(
            buf.readZigZong(),
            buf.readZigZong(),
            buf.readUInt8(),
            buf.readBool(),
            buf.readBool(),
            buf.readFloatLE()
        );
    }
}