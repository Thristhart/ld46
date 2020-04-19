import { FlipperLine } from "@entities/flipperLine";
import { entities, defaultFlipperSpeedMultiplier, player } from "@global";
import {
    FIXED_TIMESTEP,
    FLIPPER_RADIUS_START,
    FLIPPER_RADIUS_END,
    FLIPPER_LENGTH,
    FLIPPER_ANGULAR_SPEED,
} from "@constants";
import { Entity } from "@entities/entity";
import { Flippy } from "@behaviors/flippy";
import Vector from "victor";
import { FlipperCircle } from "@entities/flipperCircle";
import { findClosestPoint } from "@behaviors/collidable";
import { FlipperVisual } from "@entities/flipperVisual";

function mod(a: number, n: number) {
    return ((a % n) + n) % n;
}

function distanceBetweenAngles(targetA: number, sourceA: number) {
    const angle = mod(targetA - sourceA, Math.PI * 2);
    return mod(angle + Math.PI, Math.PI * 2) - Math.PI;
}

export class Flipper {
    private internalAngle = Math.PI / 4;
    topLine: ReturnType<typeof FlipperLine>;
    bottomLine: ReturnType<typeof FlipperLine>;
    startCircle: ReturnType<typeof FlipperCircle>;
    endCircle: ReturnType<typeof FlipperCircle>;
    visual: ReturnType<typeof FlipperVisual>;

    constructor(public x: number, public y: number, public isLeft: boolean) {
        this.topLine = FlipperLine(x, y, x, y);
        this.bottomLine = FlipperLine(x, y, x, y);
        this.startCircle = FlipperCircle(x, y, FLIPPER_RADIUS_START, 0);
        this.endCircle = FlipperCircle(x, y, FLIPPER_RADIUS_END, defaultFlipperSpeedMultiplier);
        this.visual = FlipperVisual(x, y);
        entities.push(this.visual);
        entities.push(this.topLine);
        entities.push(this.bottomLine);
        entities.push(this.startCircle);
        entities.push(this.endCircle);

        this.calculateComponentPropertiesFromAngle();
    }

    calculateComponentPropertiesFromAngle() {
        const cosAngle = Math.cos(this.internalAngle);
        const sinAngle = Math.sin(this.internalAngle);

        const normal = new Vector(FLIPPER_LENGTH * sinAngle, -FLIPPER_LENGTH * cosAngle).normalize();
        const startRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_START);
        const endRadiusVector = normal.clone().multiplyScalar(FLIPPER_RADIUS_END);

        (this.topLine as any).isLeft = this.isLeft;
        (this.bottomLine as any).isLeft = this.isLeft;

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
                    console.log(closestPoint);
                    player.position.copy(closestPoint);
                    (player as any).velocity.add(
                        collider.normal.clone().multiplyScalar((-speed * (collider as any).speedMultiplier) / 10)
                    );
                    // player.update(FIXED_TIMESTEP);
                    // collider.update(FIXED_TIMESTEP);
                }
            }

            this.angle -= speed;

            ((this.topLine as unknown) as Entity<typeof Flippy>).angularSpeed = speed * (this.isLeft ? 1 : -1);
            ((this.bottomLine as unknown) as Entity<typeof Flippy>).angularSpeed = speed * (this.isLeft ? -1 : 1);
            ((this.startCircle as unknown) as Entity<typeof Flippy>).angularSpeed = speed * (this.isLeft ? 1 : -1);
            ((this.endCircle as unknown) as Entity<typeof Flippy>).angularSpeed = speed * (this.isLeft ? -1 : 1);
            if (Math.abs(distance) < FLIPPER_ANGULAR_SPEED) {
                this.angle = angle;
                ((this.topLine as unknown) as Entity<typeof Flippy>).angularSpeed = 0;
                ((this.bottomLine as unknown) as Entity<typeof Flippy>).angularSpeed = 0;
                ((this.startCircle as unknown) as Entity<typeof Flippy>).angularSpeed = 0;
                ((this.endCircle as unknown) as Entity<typeof Flippy>).angularSpeed = 0;
                clearInterval(this.transitionInterval);
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
}
