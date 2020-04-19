import { buildBehavior } from "./behavior";
import Vector from "victor";

export const LineSegment = buildBehavior({
    properties: () => ({
        endPoint: new Vector(0, 0),
        normal: new Vector(0, 0),
    }),
    update(entity) {
        const segment = entity.endPoint.clone().subtract(entity.position);
        entity.normal = new Vector(segment.y, -segment.x).normalize();
    },
});
