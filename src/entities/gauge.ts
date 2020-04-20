import { Color } from "@behaviors/color";
import { Measuring } from "@behaviors/measuring";
import { Rectangular } from "@behaviors/rectangular";
import { buildEntity } from "./entity";

export const Gauge = buildEntity({
    behaviors: [Measuring, Rectangular, Color],
    init(entity, maximum: number, color = "blue") {
        entity.width = 200;
        entity.height = 32;
        entity.color = color;
        entity.maximum = maximum;
        entity.currentValue = 0;
    },
    draw(entity, context) {
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.fillStyle = entity.color;
        context.beginPath();
        context.rect(entity.x, entity.y, entity.width, entity.height);
        context.closePath();
        context.stroke();

        const filledWidth = (entity.currentValue / entity.maximum) * entity.width;
        context.fillRect(entity.x, entity.y, filledWidth, entity.height - 2.5);
    },
});
