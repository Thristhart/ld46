import { Collidable } from "@behaviors/collidable";
import { Zone } from "@behaviors/zone";
import { ARENA_HEIGHT, ARENA_WIDTH } from "@constants";
import { player } from "@index";
import Vector from "victor";
import { buildEntity } from "./entity";

export const Sunray = buildEntity({
    behaviors: [Collidable, Zone],
    init(entity, leftSideStart: Vector, leftSideEnd: Vector, rightSideStart: Vector, rightSideEnd: Vector) {
        entity.leftSideStart = leftSideStart;
        entity.leftSideEnd = leftSideEnd;
        entity.rightSideStart = rightSideStart;
        entity.rightSideEnd = rightSideEnd;
    },
    draw(entity, context) {
        if (!localStorage.getItem("debug")) {
            return;
        }
        let wallColor = "black";
        for (const collision of entity.collidingWith) {
            if (collision.type === "CircleAndZone" && collision.ent === player) {
                wallColor = "red";
            }
        }

        context.strokeStyle = wallColor;
        context.beginPath();
        context.moveTo(entity.leftSideStart.x, entity.leftSideStart.y);
        context.lineTo(entity.leftSideEnd.x, entity.leftSideEnd.y);
        context.closePath();

        context.stroke();

        context.strokeStyle = wallColor;
        context.beginPath();
        context.moveTo(entity.rightSideStart.x, entity.rightSideStart.y);
        context.lineTo(entity.rightSideEnd.x, entity.rightSideEnd.y);
        context.closePath();

        context.stroke();

        const leftSideDiff = entity.leftSideEnd.clone().subtract(entity.leftSideStart);
        const leftSideNormal = new Vector(leftSideDiff.y, -leftSideDiff.x).normalize();

        context.strokeStyle = "green";
        context.beginPath();
        context.moveTo(entity.leftSideStart.x, entity.leftSideStart.y);
        context.lineTo(entity.leftSideStart.x + leftSideNormal.x * 80, entity.leftSideStart.y + leftSideNormal.y * 80);
        context.moveTo(entity.leftSideStart.x + leftSideNormal.x * 80, entity.leftSideStart.y + leftSideNormal.y * 80);
        context.arc(
            entity.leftSideStart.x + leftSideNormal.x * 80,
            entity.leftSideStart.y + leftSideNormal.y * 80,
            10,
            0,
            Math.PI * 2
        );
        context.closePath();
        context.stroke();

        const rightSideDiff = entity.rightSideEnd.clone().subtract(entity.rightSideStart);
        const rightSideNormal = new Vector(rightSideDiff.y, -rightSideDiff.x).normalize();

        context.strokeStyle = "red";
        context.beginPath();
        context.moveTo(entity.rightSideStart.x, entity.rightSideStart.y);
        context.lineTo(
            entity.rightSideStart.x + rightSideNormal.x * 80,
            entity.rightSideStart.y + rightSideNormal.y * 80
        );
        context.moveTo(
            entity.rightSideStart.x + rightSideNormal.x * 80,
            entity.rightSideStart.y + rightSideNormal.y * 80
        );
        context.arc(
            entity.rightSideStart.x + rightSideNormal.x * 80,
            entity.rightSideStart.y + rightSideNormal.y * 80,
            10,
            0,
            Math.PI * 2
        );
        context.closePath();
        context.stroke();
    },
});

export const buildRay = (
    x: number,
    y: number,
    goToX: number,
    goToY: number,
    rightx: number,
    righty: number,
    rightgoToX: number,
    rightgoToY: number
) => {
    return Sunray(
        0,
        0,
        new Vector(x - ARENA_WIDTH / 2, y - ARENA_HEIGHT),
        new Vector(goToX - ARENA_WIDTH / 2, goToY - ARENA_HEIGHT),
        new Vector(rightx - ARENA_WIDTH / 2, righty - ARENA_HEIGHT),
        new Vector(rightgoToX - ARENA_WIDTH / 2, rightgoToY - ARENA_HEIGHT)
    );
};
