import { AudioController } from "@audio";
import { Bounce } from "@behaviors/bounce";
import { Collidable } from "@behaviors/collidable";
import { LineSegment } from "@behaviors/lineSegment";
import { Solid } from "@behaviors/solid";
import { player } from "@index";
import { buildEntity } from "./entity";

export const FixedSegment = buildEntity({
    behaviors: [Collidable, Solid, Bounce, LineSegment],
    init(entity, toX: number, toY: number, bounceFactor: number) {
        entity.endPoint.x = toX;
        entity.endPoint.y = toY;
        (entity as any).bounceFactor = bounceFactor;
    },
    update(entity) {
        entity.collidingWith.forEach((collision) => {
            if (collision.ent === player) {
                if (entity.hasBehavior(LineSegment)) {
                    AudioController.playSoundForCollision(collision);
                }
            }
        });
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
