import { LineSegment } from "@behaviors/lineSegment";
import { Rotatable } from "@behaviors/rotatable";
import { DEAD_PLANT_BROWN, FLIPPER_LENGTH, FLIPPER_RADIUS_END, FLIPPER_RADIUS_START, PLANT_GREEN } from "@constants";
import { GamePhase } from "@global";
import Vector from "victor";
import { buildEntity } from "./entity";

export const FlipperVisual = buildEntity({
    behaviors: [LineSegment, Rotatable],
    draw(entity, context) {
        const cosAngle = Math.cos(entity.angle);
        const sinAngle = Math.sin(entity.angle);
        const normal = new Vector(FLIPPER_LENGTH * sinAngle, -FLIPPER_LENGTH * cosAngle).normalize();
        const startRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_START);
        const endRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_END);

        context.fillStyle = GamePhase.GameOver ? DEAD_PLANT_BROWN : PLANT_GREEN;
        context.beginPath();
        context.moveTo(entity.x + startRadiusVector.x, entity.y + startRadiusVector.y);
        context.lineTo(
            entity.x + endRadiusVector.x + FLIPPER_LENGTH * cosAngle,
            entity.y + endRadiusVector.y + FLIPPER_LENGTH * sinAngle
        );
        context.lineTo(
            entity.x - endRadiusVector.x + FLIPPER_LENGTH * cosAngle,
            entity.y - endRadiusVector.y + FLIPPER_LENGTH * sinAngle
        );
        context.lineTo(entity.x - startRadiusVector.x, entity.y - startRadiusVector.y);
        context.closePath();
        context.fill();
    },
});
