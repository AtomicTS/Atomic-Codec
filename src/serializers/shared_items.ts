import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { ItemStack } from "../packets/inventory_transaction";

export function writeItem(buf: BufferWriter, item: ItemStack) {
  buf.writeZigZag32(item.networkId);
  if (item.networkId === 0) return;

  buf.writeUInt16LE(item.count ?? 0);
  buf.writeVarInt(item.metadata ?? 0);
  const hasStackId = item.itemStackId !== undefined && item.itemStackId !== null;
  buf.writeUInt8(hasStackId ? 1 : 0);
  if (hasStackId) {
    buf.writeZigZag32(item.itemStackId!);
  }

  buf.writeZigZag32(item.networkBlockId ?? 0);
  const extra = item.extras ?? Buffer.alloc(0);
  buf.writeVarInt(extra.length);
  buf.writeBuffer(extra);
}

export function readItem(buf: BufferReader): ItemStack {
  const networkId = buf.readZigZag();
  if (networkId === 0) return { networkId };

  const count = buf.readUInt16LE();
  const metadata = buf.readVarInt();

  const itemStackId = buf.readBool() ? buf.readZigZag32() : null;
  const networkBlockId = buf.readZigZag32();

  const length = buf.readVarInt();
  const extras = length > 0 ? (buf.skip(length), null) : null;
  return { networkId, count, metadata, itemStackId, networkBlockId, extras };
}