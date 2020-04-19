import "./index.css";
import { render } from "./render";
import { entities } from "@global";
import { FIXED_TIMESTEP } from "@constants";

let lastFrameUpdateTime: number;

const gameLoop = () => {
    const timestamp = performance.now();

    if (lastFrameUpdateTime === undefined) {
        lastFrameUpdateTime = timestamp;
    }
    const actualDelta = timestamp - lastFrameUpdateTime;
    const dt = FIXED_TIMESTEP * 0.01;

    entities.forEach((ent) => {
        ent.behaviors.forEach((behavior) => {
            behavior.beforeUpdate(ent);
        });
    });
    entities.forEach((ent) => {
        ent.update(dt);
    });

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

requestAnimationFrame(drawLoop);
setInterval(gameLoop, FIXED_TIMESTEP);
