import { buildBehavior } from "./behavior";
import { Collidable, findClosestPoint } from "./collidable";
import { Kinematic } from "./kinematic";
import Vector from "victor";
import { Wall } from "./wall";
import { Circular } from "./circular";
import { LineSegment } from "./lineSegment";
import { defaultFlipperSpeedMultiplier, entities } from "@global";
import { DebugVectorParticle } from "@entities/debugVectorParticle";

export const Flippy = buildBehavior({
    properties: () => ({
        ...Collidable.properties(),
        angularSpeed: 0,
        speedMultiplier: defaultFlipperSpeedMultiplier,
        isLeft: false,
    }),
    update(me) {
        for (const collision of me.collidingWith) {
            const entCollidingWith = collision.ent;
            if (me.hasBehavior(LineSegment) && me.angularSpeed !== 0) {
                if (entCollidingWith.hasBehavior(Kinematic)) {
                    const start = me.isLeft ? me.endPoint.clone() : me.position.clone();

                    const closestPoint = findClosestPoint(
                        me.position.clone(),
                        me.endPoint.clone(),
                        entCollidingWith.position.clone()
                    );
                    const distanceFromOrigin = start.distance(closestPoint);
                    const length = me.position.distance(me.endPoint);
                    const paddleVelocity = me.normal
                        .clone()
                        .multiplyScalar(
                            -(Math.abs(me.angularSpeed) * me.speedMultiplier * distanceFromOrigin) / length
                        );
                    entities.push(DebugVectorParticle(closestPoint.x, closestPoint.y, paddleVelocity, "blue"));
                    entCollidingWith.velocity.add(paddleVelocity);
                    return;
                }
            } else if (me.hasBehavior(Circular) && me.angularSpeed !== 0) {
                if (entCollidingWith.hasBehavior(Kinematic)) {
                    const AtB = me.position.clone().subtract(entCollidingWith.position.clone());
                    const direction = AtB.normalize();

                    const speed = -Math.abs(me.angularSpeed) * me.speedMultiplier;
                    const paddleVelocity = direction.multiplyScalar(speed);
                    entities.push(DebugVectorParticle(me.position.x, me.position.y, paddleVelocity, "red"));
                    entCollidingWith.velocity.add(paddleVelocity);
                    return;
                }
            }
        }
    },
});
