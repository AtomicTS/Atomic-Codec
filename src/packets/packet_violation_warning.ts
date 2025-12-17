export interface PacketViolationWarningPacket {
  violation_type?: string | number;
  severity?: number | string;
  packet_id?: string | number;
  reason?: string;
}
