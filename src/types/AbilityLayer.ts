import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AbilityLayerType } from "../enums/AbilityLayerType ";
import { AbilitySet } from "./AbilitySet";

export class AbilityLayer {
    public readonly type: AbilityLayerType;
    public readonly abilities: Array<AbilitySet>;
    public readonly flySpeed: number;
    public readonly verticalFlySpeed: number;
    public readonly walkSpeed: number;

    public constructor(
        type: AbilityLayerType,
        abilities: Array<AbilitySet>,
        flySpeed: number,
        verticalFlySpeed: number,
        walkSpeed: number
    ) {
        this.type = type;
        this.abilities = abilities;
        this.flySpeed = flySpeed;
        this.verticalFlySpeed = verticalFlySpeed;
        this.walkSpeed = walkSpeed;
    }

    public static read(buf: BufferReader): Array<AbilityLayer> {
        const layers: Array<AbilityLayer> = [];
        const amount = buf.readVarInt();

        for (let i = 0; i < amount; i++) {
            const type: AbilityLayerType = buf.readUInt16LE();
            const abilities = AbilitySet.read(buf);
            const flySpeed = buf.readFloatLE();
            const verticalFlySpeed = buf.readFloatLE();
            const walkSpeed = buf.readFloatLE();

            layers.push(new AbilityLayer(type, abilities, flySpeed, verticalFlySpeed, walkSpeed));
        }

        return layers;
    }

    public static write(buf: BufferWriter, value: Array<AbilityLayer>): void {
        buf.writeVarInt(value.length);

        for (const layer of value) {
            buf.writeVarInt(layer.type);
            AbilitySet.write(buf, layer.abilities);
            buf.writeFloatLE(layer.flySpeed);
            buf.writeFloatLE(layer.verticalFlySpeed);
            buf.writeFloatLE(layer.walkSpeed);
        }
    }
}