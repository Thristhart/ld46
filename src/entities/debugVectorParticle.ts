import { Color } from "@behaviors/color";
import { Decay } from "@behaviors/decay";
import { LineSegment } from "@behaviors/lineSegment";
import { entities } from "@global";
import Vector from "victor";
import { buildEntity } from "./entity";

export const DebugVectorParticle = buildEntity({
    behaviors: [Decay, LineSegment, Color],
    init(entity, vector: Vector, color = "red") {
        entity.endPoint = vector.clone().add(entity.position);
        entity.color = color;
    },
    draw(entity, context) {
        if (!localStorage.getItem("debug")) {
            return;
        }
        context.lineWidth = 1;
        context.strokeStyle = entity.color;
        context.beginPath();
        context.moveTo(entity.x, entity.y);
        context.lineTo(entity.endPoint.x, entity.endPoint.y);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.arc(entity.endPoint.x, entity.endPoint.y, 10, 0, Math.PI * 2);
        context.closePath();

        context.stroke();
    },
});

export const debugVector = (x: number, y: number, vector: Vector, color = "red") => {
    if (!localStorage.getItem("debug")) {
        return;
    }
    entities.push(DebugVectorParticle(x, y, vector, color));
};
