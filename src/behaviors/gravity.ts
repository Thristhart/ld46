import Vector from "victor";
import { buildBehavior } from "./behavior";
import { Circular } from "./circular";

export const Gravity = buildBehavior({
    properties: () => ({
        acceleration: new Vector(0, 0),
    }),

    update(entity, dt: number) {
        const massAmp = entity.hasBehavior(Circular) ? (1 / entity.radius) * 20 : 1;
        entity.acceleration.addScalarY(9.8 / massAmp);
    },
});
