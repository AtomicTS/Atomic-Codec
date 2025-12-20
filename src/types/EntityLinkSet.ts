import { BufferReader } from "../BufferReader";
import { BufferWriter } from "../BufferWriter";
import { EntityLink } from "./EntityLink";

export class EntityLinkSet {
    public static read(buf: BufferReader): Array<EntityLink> {
        const links: Array<EntityLink> = [];
        const amount = buf.readVarInt();

        for (let i = 0; i < amount; i++) {
            links.push(EntityLink.read(buf));
        }

        return links;
    }

    public static write(buf: BufferWriter, value: Array<EntityLink>): void {
        buf.writeVarInt(value.length);
        for (const link of value) EntityLink.write(buf, link);
    }
}