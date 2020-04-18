import Vector from "victor";
import { buildBehavior } from "./behavior";

export const Gravity = buildBehavior(
    {
        acceleration: new Vector(0, 0),
    },
    (entity, dt: number) => {
        entity.acceleration.addScalarY(9.8);
    }
);
