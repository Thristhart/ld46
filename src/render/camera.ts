import { AudioController } from "@audio";
import { buildBehavior } from "@behaviors/behavior";
import { ARENA_HEIGHT, ARENA_WIDTH } from "@constants";
import { buildEntity } from "@entities/entity";
import { GamePhase, GameState } from "@global";
import { player } from "@index";
import { canvas } from "@render";

const Scalable = buildBehavior({
    properties: () => ({
        scale: defaultScale,
    }),
});

const SCREEN_BOTTOM_BUFFER = 200;
const SCREEN_TOP_BUFFER = 200;

const defaultScale = 0.55;

export const Camera = buildEntity({
    behaviors: [Scalable],
    update(entity, dt) {
        const bestScaleForMenu = Math.min(window.innerWidth / 860, 1);

        const minScaleToSeeArenaWidth = window.innerWidth / ARENA_WIDTH;
        const bestScaleForGameplay =
            minScaleToSeeArenaWidth < defaultScale
                ? Math.min(
                      minScaleToSeeArenaWidth,
                      window.innerHeight / (ARENA_HEIGHT + SCREEN_BOTTOM_BUFFER + SCREEN_TOP_BUFFER)
                  )
                : defaultScale;

        if (GameState.phase === GamePhase.MenuScreen) {
            entity.position.y = -ARENA_HEIGHT;
            entity.scale = bestScaleForMenu;
            return;
        }

        if (GameState.phase === GamePhase.MenuScreenAnimation) {
            const progression = GameState.timeOnCurrentPhase / 30;
            if (progression > 1) {
                GameState.phase = GamePhase.Intro;
                AudioController.playBgMusic();
                console.log("play bgs");
            } else {
                const visibleHeightAtBestScaleForGameplay = canvas.height / bestScaleForGameplay;
                const targetHeight = -visibleHeightAtBestScaleForGameplay / 2 + SCREEN_BOTTOM_BUFFER;
                entity.scale = bestScaleForMenu - (bestScaleForMenu - bestScaleForGameplay) * progression;
                entity.position.y = -ARENA_HEIGHT - (-ARENA_HEIGHT - targetHeight) * progression;
            }
            return;
        }

        entity.position.y = player.y;
        entity.scale = bestScaleForGameplay;

        const visibleWidth = canvas.width / entity.scale;
        const visibleHeight = canvas.height / entity.scale;

        const visibilityBounds = {
            left: entity.position.x - visibleWidth / 2,
            right: entity.position.x + visibleWidth / 2,
            top: entity.position.y - visibleHeight / 2,
            bottom: entity.position.y + visibleHeight / 2,
        };

        // no reason to move the camera to follow the player, everything is visible
        if (visibleHeight >= ARENA_HEIGHT + SCREEN_TOP_BUFFER + SCREEN_BOTTOM_BUFFER && visibleWidth >= ARENA_WIDTH) {
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
