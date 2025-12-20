
export interface MoveEntityDelta {
    runtimeId: bigint;
    flags: number;
    x: number;
    y: number;
    z: number;
    pitch: number;
    yaw: number;
    headYaw: number;
}