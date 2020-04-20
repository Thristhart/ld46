import { AudioController } from "@audio";
import { ARENA_HEIGHT, ARENA_WIDTH, FIXED_TIMESTEP } from "@constants";
import { Bumper } from "@entities/bumper";
import { FixedSegment } from "@entities/FixedSegment";
import { Gauge } from "@entities/gauge";
import { GrowthMeter } from "@entities/growthMeter";
import { OuterWall } from "@entities/outerWall";
import { Player } from "@entities/player";
import { buildRay } from "@entities/sunRay";
import { Flipper } from "@flipper";
import { entities, GamePhase, GameState } from "@global";
import "./index.css";
import { camera, canvas, render } from "./render";

let lastFrameUpdateTime: number;

let lastPhase: GamePhase = GamePhase.Intro;

const gameLoop = () => {
    const timestamp = performance.now();

    if (lastFrameUpdateTime === undefined) {
        lastFrameUpdateTime = timestamp;
    }
    const actualDelta = timestamp - lastFrameUpdateTime;
    const dt = FIXED_TIMESTEP * 0.01;

    GameState.timeOnCurrentPhase += dt;

    if (lastPhase !== GameState.phase) {
        if (GameState.phase === GamePhase.GameOver) {
            canvas.style.backgroundColor = "black";
        } else {
            canvas.style.backgroundColor = "#186966";
        }
        GameState.timeOnCurrentPhase = 0;
    }
    lastPhase = GameState.phase;

    if (GameState.phase === GamePhase.Standard) {
        if (!AudioController.sounds.bgMusic.playing()) {
            AudioController.playBgMusic();
        }
        entities.forEach((ent) => {
            ent.behaviors.forEach((behavior) => {
                behavior.beforeUpdate(ent);
            });
        });
        entities.forEach((ent) => {
            ent.update(dt);
        });
    } else {
        AudioController.sounds.bgMusic.stop();
        camera.update(dt);
    }

    lastFrameUpdateTime = timestamp;
};

let lastDrawUpdateTime: number;
const drawLoop = (timestamp: number) => {
    if (lastDrawUpdateTime === undefined) {
        lastDrawUpdateTime = timestamp;
    }
    requestAnimationFrame(drawLoop);

    const dt = timestamp - lastDrawUpdateTime;
    render(dt);

    lastDrawUpdateTime = timestamp;
};
export let player: ReturnType<typeof Player>;

export let waterGauge: ReturnType<typeof Gauge>;

export let leftFlipper: Flipper;
export let rightFlipper: Flipper;

export function setup() {
    GameState.phase = GamePhase.GameOver;
    player = Player(60, -60);
    entities.push(player);

    const bottomLeftCorner = FixedSegment(-ARENA_WIDTH / 6, 0, -ARENA_WIDTH / 2, -ARENA_HEIGHT / 6, 0.65);
    entities.push(bottomLeftCorner);

    const bottomRightCorner = FixedSegment(ARENA_WIDTH / 2, -ARENA_HEIGHT / 6, ARENA_WIDTH / 6, 0, 0.65);
    entities.push(bottomRightCorner);

    const leftWall = OuterWall(
        bottomLeftCorner.endPoint.x,
        bottomLeftCorner.endPoint.y,
        bottomLeftCorner.endPoint.x,
        -ARENA_HEIGHT + ARENA_WIDTH / 2,
        0.65
    );
    entities.push(leftWall);

    const rightWall = OuterWall(
        bottomRightCorner.x,
        -ARENA_HEIGHT + ARENA_WIDTH / 2,
        bottomRightCorner.x,
        bottomRightCorner.y,
        0.65
    );
    entities.push(rightWall);

    const arcWall = (
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        numSegments: number
    ) => {
        const anglePerSegment = (endAngle - startAngle) / numSegments;
        for (let i = 0; i < numSegments; i++) {
            const segmentStartAngle = startAngle + anglePerSegment * i;
            const startX = x + Math.cos(segmentStartAngle) * radius;
            const startY = y + Math.sin(segmentStartAngle) * radius;
            const endX = x + Math.cos(segmentStartAngle + anglePerSegment) * radius;
            const endY = y + Math.sin(segmentStartAngle + anglePerSegment) * radius;
            entities.push(OuterWall(startX, startY, endX, endY, 0.65));
        }
    };

    arcWall(0, -ARENA_HEIGHT + ARENA_WIDTH / 2, ARENA_WIDTH / 2, -Math.PI, 0, 30);

    entities.push(
        buildRay(
            66,
            182,
            128,
            392,

            324,
            330,
            141,
            95
        )
    );

    entities.push(
        buildRay(
            128,
            392,
            168,
            525,

            325,
            491,
            247,
            355
        )
    );

    entities.push(
        buildRay(
            248,
            356,
            502,
            875,

            601,
            839,
            293,
            343
        )
    );

    entities.push(
        buildRay(
            200,
            520,
            298,
            760,

            420,
            721,
            325,
            491
        )
    );

    entities.push(
        buildRay(
            298,
            760,
            600,
            1520,

            648,
            1471,
            341,
            750
        )
    );

    entities.push(
        buildRay(
            505,
            879,
            756,
            1363,

            778,
            1342,
            537,
            867
        )
    );

    leftFlipper = new Flipper(
        bottomLeftCorner.x - Math.cos(-Math.PI / 4) * 20,
        bottomLeftCorner.y - Math.sin(-Math.PI / 4) * 20,
        true
    );
    rightFlipper = new Flipper(
        bottomRightCorner.endPoint.x - Math.cos((-Math.PI * 3) / 4) * 20,
        bottomRightCorner.endPoint.y - Math.sin((-Math.PI * 3) / 4) * 20,
        false
    );

    entities.push(Bumper(0, -820, "white"));

    entities.push(Bumper(-200, -700, "white"));
    entities.push(Bumper(200, -700, "white"));

    entities.push(Bumper(-230, -1030, "grey"));
    entities.push(Bumper(-50, -1240, "grey"));

    entities.push(Bumper(0, -1450, "black"));

    waterGauge = Gauge(-ARENA_WIDTH / 2, 132, 25, "blue");
    entities.push(waterGauge);

    const growthMeter = GrowthMeter(ARENA_WIDTH / 4, 0);
    entities.push(growthMeter);
}

const DIED_PHASE_PAUSE = 15;

const Input = {
    onLeftDown() {
        if (GameState.phase === GamePhase.Intro) {
            GameState.phase = GamePhase.Standard;
        }
        if (GameState.phase === GamePhase.Died) {
            if (GameState.timeOnCurrentPhase < DIED_PHASE_PAUSE) {
                return;
            } else {
                GameState.phase = GamePhase.Standard;
            }
        }
        leftFlipper.flipUp();
    },
    onRightDown() {
        if (GameState.phase === GamePhase.Intro) {
            GameState.phase = GamePhase.Standard;
        }
        if (GameState.phase === GamePhase.Died) {
            if (GameState.timeOnCurrentPhase < DIED_PHASE_PAUSE) {
                return;
            } else {
                GameState.phase = GamePhase.Standard;
            }
        }
        rightFlipper.flipUp();
    },
    onLeftUp() {
        leftFlipper.flipDown();
    },
    onRightUp() {
        rightFlipper.flipDown();
    },
};

window.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        Input.onLeftDown();
        event.preventDefault();
    }
    if (event.button === 2) {
        Input.onRightDown();
        event.preventDefault();
    }
});
window.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        Input.onLeftUp();
        event.preventDefault();
    }
    if (event.button === 2) {
        Input.onRightUp();
        event.preventDefault();
    }
});
window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

setup();

// @ts-ignore
window.debug.player = player;

requestAnimationFrame(drawLoop);
setInterval(gameLoop, FIXED_TIMESTEP);
