import { buildEntity } from "./entity";
import { Gravity } from "@behaviors/gravity";
import { Kinematic } from "@behaviors/kinematic";
import { Circular } from "@behaviors/circular";
import { Collidable } from "@behaviors/collidable";
import { Bounce } from "@behaviors/bounce";

export const Player = buildEntity({
    // it's important that Gravity is before kinematic, because gravity needs to be applied first
    behaviors: [Gravity, Circular, Collidable, Bounce, Kinematic],
    init(entity) {
        entity.radius = 20;
        (entity as any).bounceFactor = 0.4;
    },
    draw(entity, context) {
        context.fillStyle = "#b57a1e";
        context.beginPath();
        context.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
        context.fill();
    },
    update(entity) {
        if (entity.y > 300) {
            entity.y = -700;
        }
    },
});
