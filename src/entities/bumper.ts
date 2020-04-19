import { buildEntity } from "./entity";
import { Bounce } from "@behaviors/bounce";
import { Collidable } from "@behaviors/collidable";
import { Circular } from "@behaviors/circular";
import cloudImageUrl from "@assets/cloud.png";

const cloudImage = new Image();
cloudImage.src = cloudImageUrl;

export const Bumper = buildEntity({
    behaviors: [Collidable, Circular, Bounce],
    init(entity) {
        entity.radius = 50;
        if (entity.hasBehavior(Bounce)) {
            entity.minAdditionalSpeed = 1;
            entity.bounceFactor = 0.4;
        }
    },
    draw(entity, context) {
        context.drawImage(
            cloudImage,
            entity.x - entity.radius * 1.2,
            entity.y - entity.radius * 1.2,
            entity.radius * 2.4,
            entity.radius * 2.4
        );
    },
});
