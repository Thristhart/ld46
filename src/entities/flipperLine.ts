import { Collidable } from "@behaviors/collidable";
import { Bounce } from "@behaviors/bounce";
import { buildEntity } from "./entity";
import { LineSegment } from "@behaviors/lineSegment";
import { Flippy } from "@behaviors/flippy";
import { PLANT_GREEN } from "@constants";

export const FlipperLine = buildEntity({
    behaviors: [Collidable, Bounce, LineSegment, Flippy],
    init(entity, toX: number, toY: number) {
        entity.endPoint.x = toX;
        entity.endPoint.y = toY;
    },
    draw(entity, context) {
        context.strokeStyle = PLANT_GREEN;
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(entity.x, entity.y);
        context.lineTo(entity.endPoint.x, entity.endPoint.y);
        context.closePath();
        context.lineWidth = 1;

        context.stroke();

        if (!localStorage.getItem("debug")) {
            return;
        }
        context.strokeStyle = "green";
        context.beginPath();
        context.moveTo(entity.x, entity.y);
        context.lineTo(entity.x + entity.normal.x * 50, entity.y + entity.normal.y * 50);
        context.closePath();

        context.stroke();
    },
});
