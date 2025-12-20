import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { AbilityIndex } from "../enums/AbilityIndex";

export class AbilitySet {
    public readonly ability: AbilityIndex;
    public readonly value: boolean;

    public constructor(ability: AbilityIndex, value: boolean) {
        this.ability = ability;
        this.value = value;
    }

    public static read(buf: BufferReader): Array<AbilitySet> {
        const flags: Array<AbilitySet> = [];

        const available = buf.readUInt32LE();
        const enabled = buf.readUInt32LE();

        for (const ability of Object.values(AbilityIndex)) {
            if ((available & (1 << (ability as AbilityIndex))) === 0) continue;

            const value = (enabled & (1 << (ability as AbilityIndex))) !== 0;
            flags.push(new AbilitySet(ability as AbilityIndex, value));
        }

        return flags;
    }

    public static write(buf: BufferWriter, flags: Array<AbilitySet>): void {
        let available = 0;
        let enabled = 0;

        for (const { ability, value } of flags) {
            available |= 1 << ability;
            enabled |= value ? 1 << ability : 0;
        }

        buf.writeUInt32LE(available);
        buf.writeUInt32LE(enabled);
    }
}