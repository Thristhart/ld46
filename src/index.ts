import "./index.css";
import { render } from "./render";
import { entities } from "@global";
import { Player } from "@entities/player";
import { Kinematic } from "@behaviors/kinematic";

let lastFrameUpdateTime: number;
const gameLoop = (timestamp: number) => {
    if (lastFrameUpdateTime === undefined) {
        lastFrameUpdateTime = timestamp;
    }
    requestAnimationFrame(gameLoop);

    const dt = (timestamp - lastFrameUpdateTime) * 0.01;

    render();

    entities.forEach((ent) => {
        ent.update(dt);
    });

    lastFrameUpdateTime = timestamp;
};

const player = Player(50, 20);
player.acceleration.y = 9.8;
entities.push(player);

requestAnimationFrame(gameLoop);
