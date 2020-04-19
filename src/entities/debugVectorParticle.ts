import { buildEntity } from "./entity";
import { Decay } from "@behaviors/decay";
import { LineSegment } from "@behaviors/lineSegment";
import Vector from "victor";
import { Color } from "@behaviors/color";

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
