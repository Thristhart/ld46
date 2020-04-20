import { AudioController } from "@audio";
import { findClosestPoint } from "@behaviors/collidable";
import {
    FIXED_TIMESTEP,
    FLIPPER_ANGULAR_SPEED,
    FLIPPER_LENGTH,
    FLIPPER_RADIUS_END,
    FLIPPER_RADIUS_START,
} from "@constants";
import { FlipperCircle } from "@entities/flipperCircle";
import { FlipperLine } from "@entities/flipperLine";
import { FlipperVisual } from "@entities/flipperVisual";
import { defaultFlipperSpeedMultiplier, entities } from "@global";
import { player } from "@index";
import Vector from "victor";

function mod(a: number, n: number) {
    return ((a % n) + n) % n;
}

export function distanceBetweenAngles(targetA: number, sourceA: number) {
    const angle = mod(targetA - sourceA, Math.PI * 2);
    return mod(angle + Math.PI, Math.PI * 2) - Math.PI;
}

const LEFT_FLIPPER_STARTANGLE = Math.PI / 5;
const LEFT_FLIPPER_ENDANGLE = -LEFT_FLIPPER_STARTANGLE;

const RIGHT_FLIPPER_STARTANGLE = Math.PI - LEFT_FLIPPER_STARTANGLE;
const RIGHT_FLIPPER_ENDANGLE = Math.PI - LEFT_FLIPPER_ENDANGLE;

export class Flipper {
    private internalAngle = Math.PI / 4;
    topLine: ReturnType<typeof FlipperLine>;
    bottomLine: ReturnType<typeof FlipperLine>;
    startCircle: ReturnType<typeof FlipperCircle>;
    endCircle: ReturnType<typeof FlipperCircle>;
    visual: ReturnType<typeof FlipperVisual>;
    broken = false;

    constructor(public x: number, public y: number, public isLeft: boolean) {
        this.topLine = FlipperLine(x, y, x, y, this);
        this.bottomLine = FlipperLine(x, y, x, y, this);
        this.startCircle = FlipperCircle(x, y, FLIPPER_RADIUS_START, 0, this);
        this.endCircle = FlipperCircle(x, y, FLIPPER_RADIUS_END, defaultFlipperSpeedMultiplier, this);
        this.visual = FlipperVisual(x, y);
        entities.push(this.visual);
        entities.push(this.topLine);
        entities.push(this.bottomLine);
        entities.push(this.startCircle);
        entities.push(this.endCircle);

        if (this.isLeft) {
            this.angle = LEFT_FLIPPER_STARTANGLE;
        } else {
            this.angle = RIGHT_FLIPPER_STARTANGLE;
        }
    }

    calculateComponentPropertiesFromAngle() {
        const cosAngle = Math.cos(this.internalAngle);
        const sinAngle = Math.sin(this.internalAngle);

        const normal = new Vector(FLIPPER_LENGTH * sinAngle, -FLIPPER_LENGTH * cosAngle).normalize();
        const startRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_START);
        const endRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_END);

        this.topLine.isLeft = this.isLeft;
        this.bottomLine.isLeft = this.isLeft;

        this.visual.angle = this.angle;

        if (this.isLeft) {
            this.topLine.x = this.x + endRadiusVector.x + FLIPPER_LENGTH * cosAngle;
            this.topLine.y = this.y + endRadiusVector.y + FLIPPER_LENGTH * sinAngle;
            this.topLine.endPoint.x = this.x + startRadiusVector.x;
            this.topLine.endPoint.y = this.y + startRadiusVector.y;

            this.bottomLine.x = this.x - startRadiusVector.x;
            this.bottomLine.y = this.y - startRadiusVector.y;
            this.bottomLine.endPoint.x = this.x - endRadiusVector.x + FLIPPER_LENGTH * cosAngle;
            this.bottomLine.endPoint.y = this.y - endRadiusVector.y + FLIPPER_LENGTH * sinAngle;

            this.startCircle.x = this.x;
            this.startCircle.y = this.y;

            this.endCircle.x = this.x + FLIPPER_LENGTH * cosAngle;
            this.endCircle.y = this.y + FLIPPER_LENGTH * sinAngle;
        } else {
            this.topLine.x = this.x + endRadiusVector.x + FLIPPER_LENGTH * cosAngle;
            this.topLine.y = this.y + endRadiusVector.y + FLIPPER_LENGTH * sinAngle;
            this.topLine.endPoint.x = this.x + startRadiusVector.x;
            this.topLine.endPoint.y = this.y + startRadiusVector.y;

            this.bottomLine.x = this.x - startRadiusVector.x;
            this.bottomLine.y = this.y - startRadiusVector.y;
            this.bottomLine.endPoint.x = this.x - endRadiusVector.x + FLIPPER_LENGTH * cosAngle;
            this.bottomLine.endPoint.y = this.y - endRadiusVector.y + FLIPPER_LENGTH * sinAngle;

            this.startCircle.x = this.x;
            this.startCircle.y = this.y;

            this.endCircle.x = this.x + FLIPPER_LENGTH * cosAngle;
            this.endCircle.y = this.y + FLIPPER_LENGTH * sinAngle;
        }
    }

    private transitionInterval: number;

    transitionToAngle(angle: number) {
        clearInterval(this.transitionInterval);

        this.transitionInterval = window.setInterval(() => {
            const distance = distanceBetweenAngles(this.angle, angle);
            const speed = Math.sign(distance) * FLIPPER_ANGULAR_SPEED;

            const flipperToPlayerVec = player.position.clone().subtractScalarX(this.x).subtractScalarY(this.y);
            if (flipperToPlayerVec.magnitude() < FLIPPER_LENGTH + FLIPPER_RADIUS_END) {
                const angleToPlayer = flipperToPlayerVec.angle();
                if (Math.abs(distanceBetweenAngles(this.angle, angleToPlayer)) <= speed) {
                    console.log("boop");
                    const collider = this.isLeft ? this.topLine : this.bottomLine;
                    const closestPoint = findClosestPoint(
                        collider.position.clone(),
                        collider.endPoint.clone(),
                        player.position.clone()
                    );
                    player.position.copy(closestPoint);
                    (player as any).velocity.add(
                        collider.normal.clone().multiplyScalar((-speed * (collider as any).speedMultiplier) / 10)
                    );
                    // player.update(FIXED_TIMESTEP);
                    // collider.update(FIXED_TIMESTEP);
                }
            }

            this.angle -= speed;

            this.topLine.angularSpeed = speed * (this.isLeft ? 1 : -1);
            this.bottomLine.angularSpeed = speed * (this.isLeft ? -1 : 1);
            this.startCircle.angularSpeed = speed * (this.isLeft ? 1 : -1);
            this.endCircle.angularSpeed = speed * (this.isLeft ? -1 : 1);
            if (Math.abs(distance) < FLIPPER_ANGULAR_SPEED) {
                this.angle = angle;
                this.topLine.angularSpeed = 0;
                this.bottomLine.angularSpeed = 0;
                this.startCircle.angularSpeed = 0;
                this.endCircle.angularSpeed = 0;
                clearInterval(this.transitionInterval);
                this.transitionInterval = undefined;
            }
        }, FIXED_TIMESTEP);
    }

    get angle() {
        return this.internalAngle;
    }
    set angle(newAngle: number) {
        this.internalAngle = newAngle;
        this.calculateComponentPropertiesFromAngle();
    }

    flipUp() {
        if (this.isLeft) {
            if (!this.broken && this.angle !== LEFT_FLIPPER_ENDANGLE) {
                this.transitionToAngle(LEFT_FLIPPER_ENDANGLE);
                AudioController.sounds.flipper.leftUp.play();
            }
        } else {
            if (!this.broken && this.angle !== RIGHT_FLIPPER_ENDANGLE) {
                this.transitionToAngle(RIGHT_FLIPPER_ENDANGLE);
                AudioController.sounds.flipper.rightUp.play();
            }
        }
    }
    flipDown() {
        if (this.isLeft) {
            if ((!this.broken && this.angle !== LEFT_FLIPPER_STARTANGLE) || this.transitionInterval !== undefined) {
                this.transitionToAngle(LEFT_FLIPPER_STARTANGLE);
                AudioController.sounds.flipper.leftDown.play();
            }
        } else {
            if ((!this.broken && this.angle !== RIGHT_FLIPPER_STARTANGLE) || this.transitionInterval !== undefined) {
                this.transitionToAngle(RIGHT_FLIPPER_STARTANGLE);
                AudioController.sounds.flipper.rightDown.play();
            }
        }
    }
}
