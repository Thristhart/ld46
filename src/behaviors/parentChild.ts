import { buildBehavior } from "./behavior";
import { Entity } from "@entities/entity";

export const Parental = buildBehavior({
    properties: () => ({
        children: [] as Entity[],
    }),
    cleanup(entity) {
        entity.children.forEach((child) => child.remove());
    },
});

export const Child = buildBehavior({
    properties: () => ({
        parent: undefined as Entity,
    }),
    cleanup(entity) {
        if (entity.parent && entity.parent.hasBehavior(Parental)) {
            entity.parent.children.splice(entity.parent.children.indexOf(entity), 1);
        }
    },
});
