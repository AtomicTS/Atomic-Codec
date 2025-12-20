import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { IPosition } from "../enums/IPosition";

export class BlockLocation implements IPosition {
    public x: number;
    public y: number;
    public z: number;

    public constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static write(buf: BufferWriter, value: BlockLocation): void {
        //Convert the y value to an unsigned value
        const y = value.y < 0 ? 4_294_967_296 + value.y : value.y;

        buf.writeZigZag(value.x);
        buf.writeVarInt(y);
        buf.writeZigZag(value.z);
    }

    public static read(buf: BufferReader): BlockLocation {
        const x = buf.readZigZag();
        let y = buf.readVarInt(); //Mojank
        const z = buf.readZigZag();

        y = 4_294_967_295 - 64 >= y ? y : y - 4_294_967_296;

        return new BlockLocation(x, y, z);
    }
}