import Vector from "victor";
import { buildBehavior } from "./behavior";

export const Gravity = buildBehavior({
    properties: () => ({
        acceleration: new Vector(0, 0),
    }),

    update(entity, dt: number) {
        entity.acceleration.addScalarY(9.8);
    },
});
