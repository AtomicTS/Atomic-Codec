import { SetEntityDataPacket, EntityPropertiesData } from "../packets/set_entity_data";
import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { PacketSerializer } from "../PacketSerializer";
import nbt from "prismarine-nbt";

function writeProperties(buf: BufferWriter, props: EntityPropertiesData) {
  buf.writeVarInt(props.ints.length);
  for (const p of props.ints) {
    buf.writeVarInt(p.index);
    buf.writeZigZag32(p.value);
  }
  buf.writeVarInt(props.floats.length);
  for (const p of props.floats) {
    buf.writeVarInt(p.index);
    buf.writeFloatLE(p.value);
  }
}

function readProperties(buf: BufferReader): EntityPropertiesData {
  const intsLen = buf.readVarInt();
  const ints = [];
  for (let i = 0; i < intsLen; i++) {
    ints.push({ index: buf.readVarInt(), value: buf.readZigZag32() });
  }
  const floatsLen = buf.readVarInt();
  const floats = [];
  for (let i = 0; i < floatsLen; i++) {
    floats.push({ index: buf.readVarInt(), value: buf.readFloatLE() });
  }
  return { ints, floats };
}

const metadataSpecialFloatKeys = new Set([134, 135]);
const metadataFlagKeys = new Set([0, 92]);
const metadataNbt = nbt.protos?.little;

function readVarIntFromBuffer(buffer: Buffer, offset: number) {
  let num = 0;
  let shift = 0;
  let cursor = offset;
  let byte: number;
  do {
    if (cursor >= buffer.length) throw new RangeError("Unexpected end of metadata while reading varint");
    byte = buffer[cursor++];
    num |= (byte & 0x7f) << shift;
    shift += 7;
    if (shift > 35) throw new RangeError("Metadata varint overflow");
  } while (byte & 0x80);
  return { value: num, size: cursor - offset };
}

function readVarInt64FromBuffer(buffer: Buffer, offset: number) {
  let result = 0n;
  let shift = 0n;
  let cursor = offset;
  let byte: number;
  do {
    if (cursor >= buffer.length) throw new RangeError("Unexpected end of metadata while reading varint64");
    byte = buffer[cursor++];
    result |= BigInt(byte & 0x7f) << shift;
    shift += 7n;
    if (shift > 70n) throw new RangeError("Metadata varint64 overflow");
  } while (byte & 0x80);
  return { value: result, size: cursor - offset };
}

function skipNbt(buffer: Buffer, offset: number) {
  if (!metadataNbt) throw new Error("prismarine-nbt little proto unavailable");
  const { size } = metadataNbt.read(buffer, offset, "nbt");
  return size;
}

function skipMetadataValue(buffer: Buffer, offset: number, type: number, key: number) {
  if (metadataFlagKeys.has(key)) {
    const { size } = readVarInt64FromBuffer(buffer, offset);
    return size;
  }
  if (metadataSpecialFloatKeys.has(key)) {
    return 4;
  }
  switch (type) {
    case 0: // byte
      return 1;
    case 1: // short
      return 2;
    case 2: // int -> zigzag32
      return readVarIntFromBuffer(buffer, offset).size;
    case 3: // float
      return 4;
    case 4: { // string
      const { value, size } = readVarIntFromBuffer(buffer, offset);
      return size + value;
    }
    case 5: { // compound / nbt
      return skipNbt(buffer, offset);
    }
    case 6: { // vec3i (zigzag32 * 3)
      let consumed = 0;
      for (let i = 0; i < 3; i++) {
        const { size } = readVarIntFromBuffer(buffer, offset + consumed);
        consumed += size;
      }
      return consumed;
    }
    case 7: { // long -> zigzag64
      return readVarInt64FromBuffer(buffer, offset).size;
    }
    case 8: // vec3f (floats)
      return 12;
    default:
      throw new Error(`Unknown metadata value type ${type}`);
  }
}

function getMetadataLength(buffer: Buffer) {
  let offset = 0;
  while (offset < buffer.length) {
    const key = buffer[offset++];
    if (key === 0xff) {
      return offset;
    }
    const { value: type, size: typeSize } = readVarIntFromBuffer(buffer, offset);
    offset += typeSize;
    const valueSize = skipMetadataValue(buffer, offset, type, key);
    offset += valueSize;
  }
  throw new RangeError("Metadata terminator not found");
}

export class SetEntityDataSerializer implements PacketSerializer<SetEntityDataPacket> {
  encode(buf: BufferWriter, p: SetEntityDataPacket) {
    buf.writeVarInt64(p.runtime_entity_id);
    buf.writeBuffer(p.metadata_raw ?? Buffer.from([0xff]));
    writeProperties(buf, p.properties ?? { ints: [], floats: [] });
    buf.writeVarInt64(p.tick);
  }

  decode(buf: BufferReader): SetEntityDataPacket {
    const runtime_entity_id = buf.readVarInt64();
    const remaining = buf.readBytes(buf.remaining());
    let metadata_raw = remaining;
    let propsStart = remaining.length;

    try {
      const metaLen = getMetadataLength(remaining);
      metadata_raw = remaining.subarray(0, metaLen);
      propsStart = metaLen;
    } catch {
      return { runtime_entity_id, metadata_raw, properties: { ints: [], floats: [] }, tick: 0n };
    }

    const propsReader = new BufferReader(remaining.subarray(propsStart));
    const properties = readProperties(propsReader);

    const tickReader = new BufferReader(remaining.subarray(propsStart + propsReader.position()));
    const tick = tickReader.remaining() > 0 ? tickReader.readVarInt64() : 0n;

    return { runtime_entity_id, metadata_raw, properties, tick };
  }
}
