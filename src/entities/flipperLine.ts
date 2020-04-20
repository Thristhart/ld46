import { Bounce } from "@behaviors/bounce";
import { Collidable } from "@behaviors/collidable";
import { Flippy } from "@behaviors/flippy";
import { LineSegment } from "@behaviors/lineSegment";
import { Solid } from "@behaviors/solid";
import { DEAD_PLANT_BROWN, PLANT_GREEN } from "@constants";
import { GamePhase, GameState } from "@global";
import { buildEntity } from "./entity";

export const FlipperLine = buildEntity({
    behaviors: [Collidable, Bounce, Solid, LineSegment, Flippy],
    init(entity, toX: number, toY: number) {
        entity.endPoint.x = toX;
        entity.endPoint.y = toY;
    },
    draw(entity, context) {
        context.strokeStyle = GameState.phase === GamePhase.GameOver ? DEAD_PLANT_BROWN : PLANT_GREEN;
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
