import { Entity } from "./entities/entity";
import { Player } from "@entities/player";
import { OuterWall } from "@entities/outerWall";
import { LineSegment } from "@behaviors/lineSegment";
import { FlipperLine } from "@entities/flipperLine";
import { Flipper } from "@flipper";
import { FixedSegment } from "@entities/FixedSegment";
import { Bumper } from "@entities/bumper";
import { ARENA_WIDTH, ARENA_HEIGHT } from "@constants";

export const entities: Entity[] = [];

export const defaultFlipperSpeedMultiplier = 400;

export const player = Player(50, -80);
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

const arcWall = (x: number, y: number, radius: number, startAngle: number, endAngle: number, numSegments: number) => {
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

const LEFT_FLIPPER_STARTANGLE = Math.PI / 5;
const LEFT_FLIPPER_ENDANGLE = -LEFT_FLIPPER_STARTANGLE;

const RIGHT_FLIPPER_STARTANGLE = Math.PI - LEFT_FLIPPER_STARTANGLE;
const RIGHT_FLIPPER_ENDANGLE = Math.PI - LEFT_FLIPPER_ENDANGLE;

const leftFlipper = new Flipper(
    bottomLeftCorner.x - Math.cos(-Math.PI / 4) * 20,
    bottomLeftCorner.y - Math.sin(-Math.PI / 4) * 20,
    true
);
leftFlipper.angle = LEFT_FLIPPER_STARTANGLE;
const rightFlipper = new Flipper(
    bottomRightCorner.endPoint.x - Math.cos((-Math.PI * 3) / 4) * 20,
    bottomRightCorner.endPoint.y - Math.sin((-Math.PI * 3) / 4) * 20,
    false
);
rightFlipper.angle = RIGHT_FLIPPER_STARTANGLE;

entities.push(Bumper(0, -700));

entities.push(Bumper(-200, -700));
entities.push(Bumper(200, -700));

window.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        leftFlipper.transitionToAngle(LEFT_FLIPPER_ENDANGLE);

        event.preventDefault();
    }
    if (event.button === 2) {
        rightFlipper.transitionToAngle(RIGHT_FLIPPER_ENDANGLE);
        event.preventDefault();
    }
});
window.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        leftFlipper.transitionToAngle(LEFT_FLIPPER_STARTANGLE);

        event.preventDefault();
    }
    if (event.button === 2) {
        rightFlipper.transitionToAngle(RIGHT_FLIPPER_STARTANGLE);
        event.preventDefault();
    }
});
window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

//@ts-ignore
window.debug = { entities, player };
