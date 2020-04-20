import waterImageSrc from "@assets/water.png";
import { Circular } from "@behaviors/circular";
import { Collidable } from "@behaviors/collidable";
import { Lifespan } from "@behaviors/lifespan";
import { Child } from "@behaviors/parentChild";
import { Rotatable } from "@behaviors/rotatable";
import { player, waterGauge } from "@index";
import { buildEntity } from "./entity";

const waterImage = new Image();
waterImage.src = waterImageSrc;

export const Water = buildEntity({
    behaviors: [Rotatable, Lifespan, Circular, Collidable, Child],
    init(entity, angle: number) {
        entity.radius = 16;
        entity.angle = angle;
    },
    update(entity) {
        if (entity.timeAlive < 10) {
            const speed = 1 - (entity.timeAlive / 10) * 0.005;
            entity.x += Math.cos(entity.angle) * speed;
            entity.y += Math.sin(entity.angle) * speed;
        }

        for (const collision of entity.collidingWith) {
            if (collision.ent === player) {
                if (waterGauge.currentValue < waterGauge.maximum) {
                    entity.remove();
                    waterGauge.currentValue += 1;
                }
            }
        }
    },
    draw(entity, context) {
        const angleToTransform = entity.angle + Math.PI / 2;
        context.translate(entity.x, entity.y);
        context.rotate(angleToTransform);
        context.drawImage(waterImage, -entity.radius, -entity.radius, entity.radius * 2, entity.radius * 2);
        context.rotate(-angleToTransform);
        context.translate(-entity.x, -entity.y);
    },
});
