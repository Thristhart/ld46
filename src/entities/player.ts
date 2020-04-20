import { AudioController } from "@audio";
import { Bounce } from "@behaviors/bounce";
import { Circular } from "@behaviors/circular";
import { Collidable } from "@behaviors/collidable";
import { Gravity } from "@behaviors/gravity";
import { Kinematic } from "@behaviors/kinematic";
import { GamePhase, GameState } from "@global";
import { waterGauge } from "@index";
import { buildEntity } from "./entity";

export let ballCount = 3;

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
    update(entity, dt) {
        if (entity.y > 300) {
            AudioController.sounds.falling.play();
            if (ballCount === 0) {
                GameState.phase = GamePhase.GameOver;
            } else {
                ballCount -= 1;
                GameState.phase = GamePhase.Died;
                entity.y = -980;
                entity.x = 5;
                if (entity.hasBehavior(Kinematic)) {
                    entity.velocity.zero();
                }
            }
        }
        let inSunlight = false;
        for (const collision of entity.collidingWith) {
            if (collision.type === "CircleAndZone") {
                inSunlight = true;
            }
        }
        if (waterGauge.currentValue > 0 && inSunlight) {
            waterGauge.currentValue -= 0.02;
            entity.radius += 0.04;
        } else {
            if (entity.radius > 10 && entity.radius < 80) {
                entity.radius -= 0.002;
            }
        }

        if (waterGauge.currentValue <= 0) {
            waterGauge.currentValue = 0;
        }
    },
});
