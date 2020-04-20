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

    if (GameState.phase === GamePhase.Intro) {
        overlayText("Press X, Right Shift,", 100, 64);
        overlayText("Right Arrow or Right Click", 100, 96);

        overlayText("Press Z, Left Shift,", -400, 64);
        overlayText("Left Arrow or Left Click", -400, 96);
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

    context.restore();

    context.fillText((1000 / dt).toFixed(2), 20, 20);
};

export const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

onResize();

window.addEventListener("resize", onResize);
