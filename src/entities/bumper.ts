import blackCloudImageUrl from "@assets/black_cloud.png";
import cloudImageUrl from "@assets/cloud.png";
import darkCloudImageUrl from "@assets/dark_cloud.png";
import { AudioController } from "@audio";
import { Bounce } from "@behaviors/bounce";
import { Circular } from "@behaviors/circular";
import { Collidable } from "@behaviors/collidable";
import { Color } from "@behaviors/color";
import { Kinematic } from "@behaviors/kinematic";
import { Parental } from "@behaviors/parentChild";
import { entities } from "@global";
import { player } from "@index";
import { debugVector } from "./debugVectorParticle";
import { buildEntity } from "./entity";
import { Water } from "./water";

const cloudImage = new Image();
cloudImage.src = cloudImageUrl;

const darkCloudImage = new Image();
darkCloudImage.src = darkCloudImageUrl;

const blackCloudImage = new Image();
blackCloudImage.src = blackCloudImageUrl;

export const Bumper = buildEntity({
    behaviors: [Collidable, Circular, Bounce, Parental, Color],
    name: "Bumper",
    init(entity, color: string) {
        entity.radius = 42;
        entity.color = color;
        if (entity.hasBehavior(Bounce)) {
            entity.minAdditionalSpeed = 1;
            entity.bounceFactor = 0.2;
        }
    },
    draw(entity, context) {
        context.drawImage(
            entity.color == "white" ? cloudImage : entity.color == "grey" ? darkCloudImage : blackCloudImage,
            entity.x - entity.radius * 1.5,
            entity.y - entity.radius * 1.5,
            entity.radius * 3,
            entity.radius * 3
        );
    },
    update(entity) {
        entity.collidingWith.forEach((collision) => {
            if (collision.ent === player) {
                if (entity.children.length === 0) {
                    if (collision.ent.hasBehavior(Kinematic)) {
                        debugVector(entity.x, entity.y, collision.ent.velocity, "purple");
                        const impactAngle = collision.ent.velocity.angle();
                        const spreadAngle = Math.PI;
                        for (let i = 0; i < 6; i++) {
                            const water = Water(
                                entity.x,
                                entity.y,
                                impactAngle - spreadAngle / 2 + (spreadAngle * i) / 6
                            );
                            water.parent = entity;
                            entity.children.push(water);
                            entities.push(water);
                            AudioController.sounds.splash.play();
                        }
                    }
                }
            }
        });
    },
});
