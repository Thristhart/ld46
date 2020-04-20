import Vector from "victor";
import { buildBehavior } from "./behavior";
import { Circular } from "./circular";

export const Kinematic = buildBehavior({
    properties: () => ({
        acceleration: new Vector(0, 0),
        velocity: new Vector(0, 0),
    }),

    update(entity, dt) {
        const newVelocityX = entity.velocity.x + entity.acceleration.x * dt;
        const newVelocityY = entity.velocity.y + entity.acceleration.y * dt;

        const massAmp = entity.hasBehavior(Circular) ? (1 / entity.radius) * 20 : 1;

        entity.position.x += ((entity.velocity.x + newVelocityX) / 2) * dt * massAmp;
        entity.position.y += ((entity.velocity.y + newVelocityY) / 2) * dt * massAmp;

        entity.velocity.x = newVelocityX;
        entity.velocity.y = newVelocityY;

        entity.acceleration.zero();
    },
});
