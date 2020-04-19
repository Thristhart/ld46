import { Collidable } from "@behaviors/collidable";
import { Bounce } from "@behaviors/bounce";
import { buildEntity } from "./entity";
import { LineSegment } from "@behaviors/lineSegment";
import { Flippy } from "@behaviors/flippy";
import { Circular } from "@behaviors/circular";
import { PLANT_GREEN, FLIPPER_RADIUS_START } from "@constants";

export const FlipperCircle = buildEntity({
    behaviors: [Collidable, Circular, Flippy],
    init(entity, radius: number, speedMultiplier: number) {
        entity.radius = radius;
        (entity as any).speedMultiplier = speedMultiplier;
    },
    draw(entity, context) {
        context.strokeStyle = PLANT_GREEN;
        context.lineWidth = 5;
        context.fillStyle = entity.radius === FLIPPER_RADIUS_START ? "#226600" : PLANT_GREEN;
        context.beginPath();
        context.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
        context.closePath();

        entity.radius === FLIPPER_RADIUS_START && context.stroke();
        context.fill();
        context.lineWidth = 1;
    },
});
