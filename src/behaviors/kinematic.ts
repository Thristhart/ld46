import Vector from "victor";
import { buildBehavior } from "./behavior";

export const Kinematic = buildBehavior({
    properties: () => ({
        acceleration: new Vector(0, 0),
        velocity: new Vector(0, 0),
    }),

    update(entity, dt) {
        const newVelocityX = entity.velocity.x + entity.acceleration.x * dt;
        const newVelocityY = entity.velocity.y + entity.acceleration.y * dt;

        entity.position.x += ((entity.velocity.x + newVelocityX) / 2) * dt;
        entity.position.y += ((entity.velocity.y + newVelocityY) / 2) * dt;

        entity.velocity.x = newVelocityX;
        entity.velocity.y = newVelocityY;

        entity.acceleration.zero();
    },
});
