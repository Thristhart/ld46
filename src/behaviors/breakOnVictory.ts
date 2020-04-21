import { AudioController } from "@audio";
import { Flipper } from "@flipper";
import { player } from "@index";
import { buildBehavior } from "./behavior";
import { Collidable } from "./collidable";

export const BreakOnVictory = buildBehavior({
    dependencies: [Collidable],
    properties: () => ({
        myFlipper: undefined as Flipper,
    }),
    update(entity) {
        for (const collision of entity.collidingWith) {
            if (collision.ent === player) {
                if (player.radius >= 80) {
                    if (!entity.myFlipper.broken) {
                        AudioController.sounds.flipperBreak.play();
                    }
                    entity.myFlipper.broken = true;
                    entity.myFlipper.transitionToAngle(Math.PI / 2);
                }
            }
        }
    },
});
