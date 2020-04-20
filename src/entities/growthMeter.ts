import { Circular } from "@behaviors/circular";
import { Measuring } from "@behaviors/measuring";
import { PLANT_GREEN } from "@constants";
import { player } from "@index";
import { buildEntity } from "./entity";

export const GrowthMeter = buildEntity({
    behaviors: [Circular, Measuring],
    init(entity) {
        entity.radius = 20;
        entity.maximum = 80;
        entity.currentValue = player.radius;
    },
    update(entity) {
        entity.currentValue = player.radius;
        if (entity.currentValue > entity.maximum) {
            entity.currentValue = entity.maximum;
        }
    },
    draw(entity, context) {
        context.fillStyle = "#b57a1e";
        context.strokeStyle = entity.currentValue >= entity.maximum ? PLANT_GREEN : "black";
        context.lineWidth = entity.currentValue >= entity.maximum ? 4 : 2;
        context.beginPath();
        context.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(entity.x, entity.y, (entity.radius * entity.currentValue) / entity.maximum, 0, Math.PI * 2);
        context.fill();
    },
});
