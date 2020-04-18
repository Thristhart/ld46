import Vector from "victor";
import { Entity } from "@entities/entity";
import { Behavior, buildBehavior } from "./behavior";
import { FRICTION_COEFFICIENT } from "@constants";

export const Kinematic = buildBehavior(
    {
        acceleration: new Vector(0, 0),
        velocity: new Vector(0, 0),
    },

    (entity, dt) => {
        const newVelocityX = entity.acceleration.x * dt;
        const newVelocityY = entity.acceleration.y * dt;

        entity.position.x += ((entity.velocity.x + newVelocityX) / 2) * dt;
        entity.position.y += ((entity.velocity.y + newVelocityY) / 2) * dt;

        entity.velocity.x = newVelocityX;
        entity.velocity.y = newVelocityY;

        entity.acceleration.zero();
    }
);
