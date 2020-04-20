import { Circular } from "@behaviors/circular";
import { Collidable } from "@behaviors/collidable";
import { Flippy } from "@behaviors/flippy";
import { Solid } from "@behaviors/solid";
import { DEAD_PLANT_BROWN, FLIPPER_RADIUS_START, PLANT_GREEN } from "@constants";
import { GamePhase, GameState } from "@global";
import { buildEntity } from "./entity";

export const FlipperCircle = buildEntity({
    behaviors: [Collidable, Solid, Circular, Flippy],
    init(entity, radius: number, speedMultiplier: number) {
        entity.radius = radius;
        (entity as any).speedMultiplier = speedMultiplier;
    },
    draw(entity, context) {
        context.strokeStyle = GameState.phase === GamePhase.GameOver ? DEAD_PLANT_BROWN : PLANT_GREEN;
        context.lineWidth = 5;

        if (entity.radius === FLIPPER_RADIUS_START) {
            context.fillStyle = GameState.phase === GamePhase.GameOver ? "#432106" : "#226600";
        } else {
            context.fillStyle = GameState.phase === GamePhase.GameOver ? DEAD_PLANT_BROWN : PLANT_GREEN;
        }

        context.beginPath();
        context.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
        context.closePath();

        entity.radius === FLIPPER_RADIUS_START && context.stroke();
        context.fill();
        context.lineWidth = 1;
    },
});
