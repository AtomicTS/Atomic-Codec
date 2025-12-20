export class BufferReader {
  constructor(private buf: Buffer, private offset = 0) { }
  getBuffer() {
    return this.buf;
  }

  remaining() {
    const rem = this.buf.length - this.offset;
    return rem < 0 ? 0 : rem;
  }

  position() {
    return this.offset;
  }

  private ensure(size: number, label: string) {
    if (this.offset < 0 || this.offset + size > this.buf.length) {
      throw new RangeError(`OOB in ${label}: offset=${this.offset} size=${size} len=${this.buf.length}`);
    }
  }

  read(length: number) {
    this.ensure(length, "read");

    const data = this.buf.subarray(this.offset, this.offset + length);
    this.offset += length;
    return data;
  }

  skip(bytes: number) {
    this.ensure(bytes, "skip");
    this.offset += bytes;
  }

  readBool() { this.ensure(1, "readBool"); return this.buf[this.offset++] === 1; }

  readInt8() {
    this.ensure(1, "readInt8");
    const v = this.buf.readInt8(this.offset);
    this.offset += 1;
    return v;
  }

  readUInt8() {
    this.ensure(1, "readUInt8");
    const v = this.buf.readUInt8(this.offset);
    this.offset += 1;
    return v;
  }

  readUInt16LE() {
    this.ensure(2, "readUInt16LE");
    const v = this.buf.readUInt16LE(this.offset);
    this.offset += 2;
    return v;
  }

  readInt16LE() {
    this.ensure(2, "readInt16LE");
    const v = this.buf.readInt16LE(this.offset);
    this.offset += 2;
    return v;
  }

  readUInt16BE() {
    this.ensure(2, "readUInt16BE");
    const v = this.buf.readUInt16BE(this.offset);
    this.offset += 2;
    return v;
  }

  readInt32LE() {
    this.ensure(4, "readInt32LE");
    const v = this.buf.readInt32LE(this.offset);
    this.offset += 4;
    return v;
  }

  readUInt32LE() {
    this.ensure(4, "readUInt32LE");
    const v = this.buf.readUInt32LE(this.offset);
    this.offset += 4;
    return v;
  }

  readInt32BE() {
    this.ensure(4, "readInt32BE");
    const v = this.buf.readInt32BE(this.offset);
    this.offset += 4;
    return v;
  }

  readFloatLE() {
    this.ensure(4, "readFloatLE");
    const v = this.buf.readFloatLE(this.offset);
    this.offset += 4;
    return v;
  }

  readFloatBE() {
    this.ensure(4, "readFloatBE");
    const v = this.buf.readFloatBE(this.offset);
    this.offset += 4;
    return v;
  }

  readBytes(length: number) {
    this.ensure(length, "readBytes");
    const slice = this.buf.subarray(this.offset, this.offset + length);
    this.offset += length;
    return slice;
  }

  readVarInt() {
    let num = 0;
    let shift = 0;

    for (let i = 0; i < 5; i++) {
      if (this.offset >= this.buf.length) {
        throw new RangeError(`OOB in readVarInt: offset=${this.offset} len=${this.buf.length}`);
      }

      const b = this.buf[this.offset++];
      num |= (b & 0x7f) << shift;

      if ((b & 0x80) === 0) return num >>> 0;

      shift += 7;
    }

    throw new RangeError("readVarInt overflow");
  }

  readVarLong() {
    let value = 0n;

    for (let i = 0; i < 10; i++) {
      let byte = this.buf[this.offset++] || 0;
      value |= (BigInt(byte) & 0x7Fn) << (BigInt(i) * 7n);
      if ((byte & 0x80) === 0) return value;
    }

    throw new Error("Varlong exceeds maximum size");
  }

  readZigZong() {
    let value = this.readVarLong();
    value = (value >> 1n) ^ (-(value & 1n));
    return value;
  }

  readZigZag() {
    let value = BigInt(this.readVarInt());
    value = (value >> 1n) ^ (-(value & 1n));
    return Number(value);
  }

  readZigZag32() {
    const v = this.readVarInt();
    return (v >>> 1) ^ -(v & 1);
  }

  readVarInt64() {
    let result = 0n;
    let shift = 0n;
    let byte: number;
    do {
      this.ensure(1, "readVarInt64");
      byte = this.buf[this.offset++];
      result |= BigInt(byte & 0x7f) << shift;
      shift += 7n;
      if (shift > 70n) throw new RangeError("BufferReader readVarInt64 overflow");
    } while (byte & 0x80);
    return result;
  }

  readZigZag64() {
    const v = this.readVarInt64();
    return (v >> 1n) ^ -(v & 1n);
  }

  readString() {
    const len = this.readVarInt();
    this.ensure(len, "readString");
    const value = this.buf.slice(this.offset, this.offset + len).toString("utf8");
    this.offset += len;
    return value;
  }

  readLittleString() {
    const len = this.readInt32LE();
    this.ensure(len, "readLittleString");
    const value = this.buf.slice(this.offset, this.offset + len).toString("utf8");
    this.offset += len;
    return value;
  }

  readUuid() {
    this.ensure(16, "readUuid");
    const slice = this.buf.subarray(this.offset, this.offset + 16);
    this.offset += 16;
    const hex = slice.toString("hex");
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
  }

  readInt64LE() {
    this.ensure(8, "readInt64LE");
    const v = this.buf.readBigInt64LE(this.offset);
    this.offset += 8;
    return v;
  }

  readUInt64LE() {
    this.ensure(8, "readUInt64LE");
    const v = this.buf.readBigUInt64LE(this.offset);
    this.offset += 8;
    return v;
  }

  readArray<T>(reader: () => T): T[] {
    const count = this.readVarInt();

    if (count < 0) {
      throw new RangeError(`Negative array length: ${count}`);
    }

    const arr = new Array<T>(count);
    for (let i = 0; i < count; i++) {
      arr[i] = reader();
    }

    return arr;
  }

  readDoubleLE() {
    this.ensure(8, "readDoubleLE");
    const v = this.buf.readDoubleLE(this.offset);
    this.offset += 8;
    return v;
  }
}
