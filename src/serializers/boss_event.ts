import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { BossEventPacket } from "../packets/boss_event";
import { PacketSerializer } from "../PacketSerializer";
import { BossEventAdd } from "../types/BossEventAdd";
import { BossEventUpdate } from "../types/BossEventUpdate";

export class BosseventSerializer implements PacketSerializer<BossEventPacket> {
    encode(buf: BufferWriter, p: BossEventPacket) {
        buf.writeZigZong(p.targetUniqueId);
        buf.writeVarInt(p.type);
        BossEventAdd.write(buf, p.add!, { parameter: p.type });
        BossEventUpdate.write(buf, p.update!, { parameter: p.type });
    }

    decode(buf: BufferReader): BossEventPacket {
        const targetUniqueId = buf.readZigZong();
        const type = buf.readVarInt();
        const add = BossEventAdd.read(buf, { parameter: type });
        const update = BossEventUpdate.read(buf, { parameter: type });

        return { add, targetUniqueId, type, update };
    }
}
