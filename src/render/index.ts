import flipOrDieSrc from "@assets/fliporDIE_small.png";
import victoryPlant1Src from "@assets/plant_grow1.png";
import victoryPlant2Src from "@assets/plant_grow2.png";
import victoryPlant3Src from "@assets/plant_grow3.png";
import { ARENA_HEIGHT, ARENA_WIDTH } from "@constants";
import { ballCount } from "@entities/player";
import { entities, GamePhase, GameState } from "@global";
import { player, waterGauge } from "@index";
import fieldBackgroundImageUrl from "../assets/fieldbg.png";
import gameOverFieldBackgroundImageUrl from "../assets/fieldbggameover.png";
import gameOverBackgroundImageUrl from "../assets/gameover.png";
import backgroundImageUrl from "../assets/sproutbig.png";
import sunlightImageUrl from "../assets/sunlight.png";
import { Camera } from "./camera";

export const canvas = document.getElementById("display") as HTMLCanvasElement;
export const context = canvas.getContext("2d");

context.imageSmoothingEnabled = false;

export const camera = Camera(0, 0);
entities.push(camera);

const background = new Image();
background.src = backgroundImageUrl;

const gameOverBackground = new Image();
gameOverBackground.src = gameOverBackgroundImageUrl;
const BG_IMAGE_WIDTH = ARENA_WIDTH * 2.3;
const BG_IMAGE_HEIGHT = BG_IMAGE_WIDTH;

const fieldBackground = new Image();
fieldBackground.src = fieldBackgroundImageUrl;

const gameOverFieldBackground = new Image();
gameOverFieldBackground.src = gameOverFieldBackgroundImageUrl;

const sunlight = new Image();
sunlight.src = sunlightImageUrl;

const victoryPlant1 = new Image();
victoryPlant1.src = victoryPlant1Src;

const victoryPlant2 = new Image();
victoryPlant2.src = victoryPlant2Src;

const victoryPlant3 = new Image();
victoryPlant3.src = victoryPlant3Src;

const VICTORY_PLANT_WIDTH = 362 * 2;
const VICTORY_PLANT_HEIGHT = 295 * 2;

const flipOrDie = new Image();
flipOrDie.src = flipOrDieSrc;

const basicFont = `"Segoe UI",Segoe,Tahoma,Arial,Verdana,sans-serif`;

export const overlayText = (text: string, x: number, y: number) => {
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.lineWidth = 4;
    context.font = `bold 30px ${basicFont}`;

    context.strokeText(text, x, y);
    context.fillText(text, x, y);
};

export const render = (dt: number) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    context.translate(canvas.width / 2 - camera.x * camera.scale, canvas.height / 2 - camera.y * camera.scale);
    context.scale(camera.scale, camera.scale);

    if (GameState.phase === GamePhase.GameOver) {
        context.drawImage(gameOverFieldBackground, -ARENA_WIDTH / 2, -ARENA_HEIGHT, ARENA_WIDTH, ARENA_HEIGHT);
        context.drawImage(
            gameOverBackground,
            -BG_IMAGE_WIDTH / 2 - 10,
            -ARENA_HEIGHT + 20,
            BG_IMAGE_WIDTH,
            BG_IMAGE_HEIGHT
        );
    } else {
        context.drawImage(fieldBackground, -ARENA_WIDTH / 2, -ARENA_HEIGHT, ARENA_WIDTH, ARENA_HEIGHT);
        context.drawImage(background, -BG_IMAGE_WIDTH / 2 - 10, -ARENA_HEIGHT + 20, BG_IMAGE_WIDTH, BG_IMAGE_HEIGHT);
    }

    context.drawImage(flipOrDie, -860 / 2, -ARENA_HEIGHT - 220);

    player.draw(context);

    context.drawImage(sunlight, -ARENA_WIDTH / 2, -ARENA_HEIGHT, ARENA_WIDTH, ARENA_HEIGHT);

    entities.forEach((ent) => {
        if (ent !== player) {
            ent.draw(context);
        }
    });

    const ballCountX = ARENA_WIDTH / 4;
    const ballCountY = 132;
    for (let i = 0; i < ballCount; i++) {
        context.fillStyle = "#b57a1e";
        context.beginPath();
        context.arc(ballCountX + i * 40, ballCountY + 20, 20, 0, Math.PI * 2);
        context.fill();
    }
    if (GameState.phase === GamePhase.MenuScreen || GameState.phase === GamePhase.MenuScreenAnimation) {
        if (window.matchMedia("(pointer: coarse)").matches) {
            overlayText("Touch anywhere to begin", -170, -ARENA_HEIGHT + 32);
        } else {
            overlayText("Press any key to begin", -160, -ARENA_HEIGHT + 32);
        }
    }

    if (GameState.phase === GamePhase.Intro) {
        if (window.matchMedia("(pointer: coarse)").matches) {
            overlayText("Touch the left side", 100, 100);

            overlayText("Touch the right side", -400, 100);
        } else {
            overlayText("Press X, Right Shift,", 100, 64);
            overlayText("Right Arrow or Right Click", 100, 96);

            overlayText("Press Z, Left Shift,", -400, 64);
            overlayText("Left Arrow or Left Click", -400, 96);
        }
    }
    if (GameState.phase === GamePhase.Died) {
        overlayText("Ball drained", -80, -1048);
        overlayText(`Water: ${Math.round(waterGauge.currentValue)}`, -200, -968);
        overlayText(`Growth: ${Math.round(((player.radius - 20) / 60) * 100)}%`, 90, -968);
        overlayText(`Balls remaining: ${ballCount}`, -100, -888);
        if (GameState.timeOnCurrentPhase > 15) {
            overlayText(`Press a flipper to continue`, -180, -448);
        }
    }
    if (GameState.phase === GamePhase.GameOver) {
        overlayText("GAME OVER", -80, -500);
    }
    if (GameState.phase === GamePhase.Victory) {
        let yMotion = (GameState.timeOnCurrentPhase / 10) * VICTORY_PLANT_HEIGHT;
        if (yMotion > VICTORY_PLANT_HEIGHT) {
            yMotion = VICTORY_PLANT_HEIGHT;
        }
        let plantY = 0 - yMotion;
        let plant = victoryPlant1;
        if (GameState.timeOnCurrentPhase > 20) {
            plant = victoryPlant2;
        }
        if (GameState.timeOnCurrentPhase > 35) {
            plant = victoryPlant3;
        }
        context.drawImage(
            plant,
            -VICTORY_PLANT_WIDTH / 2 + 20,
            plantY + 200,
            VICTORY_PLANT_WIDTH,
            VICTORY_PLANT_HEIGHT
        );
        overlayText("You kept it alive!", -100, -420);
    }

    context.restore();

    context.fillText((1000 / dt).toFixed(2), 20, 20);
};

export const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

onResize();

window.addEventListener("resize", onResize);
