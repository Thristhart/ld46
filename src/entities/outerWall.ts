import { AudioController } from "@audio";
import { Bounce } from "@behaviors/bounce";
import { Collidable } from "@behaviors/collidable";
import { Solid } from "@behaviors/solid";
import { Wall } from "@behaviors/wall";
import { player } from "@index";
import { buildEntity } from "./entity";

export const OuterWall = buildEntity({
    behaviors: [Collidable, Solid, Bounce, Wall],
    init(entity, toX: number, toY: number, bounceFactor: number) {
        entity.endPoint.x = toX;
        entity.endPoint.y = toY;
        (entity as any).bounceFactor = bounceFactor;
    },
    update(entity) {
        entity.collidingWith.forEach((collision) => {
            if (collision.ent === player) {
                if (entity.hasBehavior(Wall)) {
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
