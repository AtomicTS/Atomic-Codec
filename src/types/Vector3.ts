import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { IPosition } from "../enums/IPosition";

export class Vector3 implements IPosition {
    public x: number;
    public y: number;
    public z: number;

    public constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static read(buf: BufferReader): Vector3 {
        const x = buf.readFloatLE();
        const y = buf.readFloatLE();
        const z = buf.readFloatLE();

        return new Vector3(x, y, z);
    }

    public static write(buf: BufferWriter, value: Vector3): void {
        buf.writeFloatLE(value.x);
        buf.writeFloatLE(value.y);
        buf.writeFloatLE(value.z);
    }
}