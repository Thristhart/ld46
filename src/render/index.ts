import { entities } from "@global";
import { Camera } from "./camera";

export const canvas = document.getElementById("display") as HTMLCanvasElement;
export const context = canvas.getContext("2d");

const camera = Camera(0, 0);
entities.push(camera);

import backgroundImageUrl from "../assets/sproutbig.png";
import fieldBackgroundImageUrl from "../assets/fieldbg.png";

import { ARENA_WIDTH, ARENA_HEIGHT } from "@constants";

const background = new Image();
background.src = backgroundImageUrl;
const BG_IMAGE_WIDTH = ARENA_WIDTH * 2.3;
const BG_IMAGE_HEIGHT = BG_IMAGE_WIDTH;

const fieldBackground = new Image();
fieldBackground.src = fieldBackgroundImageUrl;

export const render = (dt: number) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    context.translate(canvas.width / 2 - camera.x * camera.scale, canvas.height / 2 - camera.y * camera.scale);
    context.scale(camera.scale, camera.scale);

    context.drawImage(fieldBackground, -ARENA_WIDTH / 2, -ARENA_HEIGHT, ARENA_WIDTH, ARENA_HEIGHT);
    context.drawImage(background, -BG_IMAGE_WIDTH / 2 - 10, -ARENA_HEIGHT + 20, BG_IMAGE_WIDTH, BG_IMAGE_HEIGHT);

    entities.forEach((ent) => ent.draw(context));

    context.restore();

    context.fillText((1000 / dt).toFixed(2), 20, 20);
};

export const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

onResize();

window.addEventListener("resize", onResize);
