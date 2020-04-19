import { buildEntity } from "./entity";
import { LineSegment } from "@behaviors/lineSegment";
import Vector from "victor";
import { Rotatable } from "@behaviors/rotatable";
import { FLIPPER_LENGTH, FLIPPER_RADIUS_START, FLIPPER_RADIUS_END, PLANT_GREEN } from "@constants";

export const FlipperVisual = buildEntity({
    behaviors: [LineSegment, Rotatable],
    draw(entity, context) {
        const cosAngle = Math.cos(entity.angle);
        const sinAngle = Math.sin(entity.angle);
        const normal = new Vector(FLIPPER_LENGTH * sinAngle, -FLIPPER_LENGTH * cosAngle).normalize();
        const startRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_START);
        const endRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_END);

        context.fillStyle = PLANT_GREEN;
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
