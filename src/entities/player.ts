import { buildEntity } from "./entity";
import { Gravity } from "@behaviors/gravity";
import { Kinematic } from "@behaviors/kinematic";
import { Circular } from "@behaviors/circular";
import { ClickToBounce } from "@behaviors/clickToBounce";

export const Player = buildEntity({
    // it's important that Gravity is before kinematic, because gravity needs to be applied first
    behaviors: [Circular, Gravity, ClickToBounce, Kinematic],
    draw(entity, context) {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
        context.fill();
    },
});
