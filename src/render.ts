import { entities } from "./global";

const canvas = document.getElementById("display") as HTMLCanvasElement;
const context = canvas.getContext("2d");

export const render = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    entities.forEach((ent) => ent.draw(context));
};

export const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

onResize();

window.addEventListener("resize", onResize);
