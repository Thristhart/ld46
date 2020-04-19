import { buildEntity } from "./entity";
import { Collidable } from "@behaviors/collidable";
import { Wall } from "@behaviors/wall";
import { Bounce } from "@behaviors/bounce";

export const OuterWall = buildEntity({
    behaviors: [Collidable, Bounce, Wall],
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
