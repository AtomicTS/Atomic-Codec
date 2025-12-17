import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { PacketViolationWarningPacket } from "../packets/packet_violation_warning";
import { PacketSerializer } from "../PacketSerializer";

const VIOLATION_MAP: Record<number, string> = { 0: "malformed" };
const VIOLATION_INV: Record<string, number> = { malformed: 0 };

const SEVERITY_MAP: Record<number, string> = { 0: "warning", 1: "final_warning", 2: "terminating" };
const SEVERITY_INV: Record<string, number> = { warning: 0, final_warning: 1, terminating: 2 };

export class PacketViolationWarningSerializer implements PacketSerializer<PacketViolationWarningPacket> {
  encode(buf: BufferWriter, p: PacketViolationWarningPacket) {
    //Violation Type
    let typeId = 0;
    if (typeof p.violation_type === "string") {
      typeId = VIOLATION_INV[p.violation_type] ?? 0;
    } else {
      typeId = p.violation_type ?? 0;
    }
    buf.writeZigZag32(typeId);

    //Severity
    let severityId = 0;
    if (typeof p.severity === "string") {
      severityId = SEVERITY_INV[p.severity] ?? 0;
    } else {
      severityId = (p.severity as number) ?? 0;
    }
    buf.writeZigZag32(severityId);

    //Packet ID
    const pktId = typeof p.packet_id === "string" ? parseInt(p.packet_id) : (p.packet_id ?? 0);
    buf.writeZigZag32(pktId);

    buf.writeString(p.reason ?? "");
  }

  decode(buf: BufferReader): PacketViolationWarningPacket {
    const typeId = buf.readZigZag32();
    const violation_type = VIOLATION_MAP[typeId] ?? typeId;
    const severityId = buf.readZigZag32();
    const severity = SEVERITY_MAP[severityId] ?? severityId;
    const packet_id = buf.readZigZag32().toString();
    const reason = buf.readString();

    return {
      violation_type,
      severity,
      packet_id,
      reason
    };

  }
}
