import { buildBehavior } from "@behaviors/behavior";
import { ARENA_HEIGHT, ARENA_WIDTH } from "@constants";
import { buildEntity } from "@entities/entity";
import { player } from "@index";
import { canvas } from "@render";

const Scalable = buildBehavior({
    properties: () => ({
        scale: 0.7,
    }),
});

const SCREEN_BOTTOM_BUFFER = 200;
const SCREEN_TOP_BUFFER = 200;

export const Camera = buildEntity({
    behaviors: [Scalable],
    update(entity, dt) {
        const visibleWidth = canvas.width / entity.scale;
        const visibleHeight = canvas.height / entity.scale;

        //entity.position.x = player.x;
        entity.position.y = player.y;

        const visibilityBounds = {
            left: entity.position.x - visibleWidth / 2,
            right: entity.position.x + visibleWidth / 2,
            top: entity.position.y - visibleHeight / 2,
            bottom: entity.position.y + visibleHeight / 2,
        };

        if (visibilityBounds.left > -ARENA_WIDTH / 2 || visibilityBounds.right < ARENA_WIDTH / 2) {
            entity.scale -= 0.1;
            return;
        }
        // no reason to move the camera to follow the player, everything is visible
        if (visibleHeight >= ARENA_HEIGHT && visibleWidth >= ARENA_WIDTH) {
            entity.position.y = -visibleHeight / 2 + SCREEN_BOTTOM_BUFFER;
            return;
        }
        if (visibilityBounds.bottom > SCREEN_BOTTOM_BUFFER) {
            entity.position.y = -visibleHeight / 2 + SCREEN_BOTTOM_BUFFER;
        }
        if (visibilityBounds.top < -ARENA_HEIGHT - SCREEN_TOP_BUFFER) {
            entity.position.y = -ARENA_HEIGHT - SCREEN_TOP_BUFFER + visibleHeight / 2;
        }
    },
});
