import { buildBehavior } from "./behavior";
import Vector from "victor";
import { Entity } from "@entities/entity";

export const Wall = buildBehavior({
    properties: () => ({
        endPoint: new Vector(0, 0),
        normal: new Vector(0, 0),
    }),
    init(entity) {
        const segment = entity.endPoint.clone().subtract(entity.position);
        entity.normal = new Vector(segment.y, -segment.x).normalize();
    },
});
