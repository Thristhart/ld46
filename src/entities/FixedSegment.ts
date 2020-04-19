import { buildEntity } from "./entity";
import { Collidable } from "@behaviors/collidable";
import { Bounce } from "@behaviors/bounce";
import { LineSegment } from "@behaviors/lineSegment";

export const FixedSegment = buildEntity({
    behaviors: [Collidable, Bounce, LineSegment],
    init(entity, toX: number, toY: number, bounceFactor: number) {
        entity.endPoint.x = toX;
        entity.endPoint.y = toY;
        (entity as any).bounceFactor = bounceFactor;
    },
    draw(entity, context) {
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(entity.x, entity.y);
        context.lineTo(entity.endPoint.x, entity.endPoint.y);
        context.closePath();

        context.stroke();
    },
});
