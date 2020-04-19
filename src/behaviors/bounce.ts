import { buildBehavior } from "./behavior";
import { Collidable, CollisionDescription } from "./collidable";
import { Kinematic } from "./kinematic";
import Vector from "victor";
import { Wall } from "./wall";
import { Circular } from "./circular";
import { LineSegment } from "./lineSegment";
import { entities } from "@global";
import { DebugVectorParticle } from "@entities/debugVectorParticle";
import { Entity } from "@entities/entity";
import { Flippy } from "./flippy";

function getSideOfVector(startPoint: Vector, endPoint: Vector, point: Vector) {
    const sample =
        (point.x - startPoint.x) * (endPoint.y - startPoint.y) - (point.y - startPoint.y) * (endPoint.x - startPoint.x);
    if (sample > 0) {
        return true;
    }
    return false;
}

function resolveWallAndCircleCollision(
    wall: Entity<typeof Wall | typeof LineSegment | typeof Bounce>,
    circle: Entity<typeof Kinematic | typeof Circular | typeof Bounce>,
    collision: CollisionDescription
) {
    if (collision.type !== "CircleAndWall") {
        return;
    }

    const AtB: Vector = wall.endPoint.clone().subtract(wall.position);

    const existingVelocitySide = getSideOfVector(
        collision.closestPointOnLine.clone().add(circle.velocity),
        wall.position,
        wall.endPoint
    );

    const normalSide = getSideOfVector(wall.position.clone().add(wall.normal), wall.position, wall.endPoint);

    if (existingVelocitySide === normalSide) {
        const tangent = AtB.clone().normalize();
        const r2Length = tangent.dot(circle.velocity);
        const r2 = tangent.clone().multiplyScalar(r2Length);
        const r1 = circle.velocity.clone().subtract(r2);

        const bounceVector = r1.clone().multiplyScalar(-1);
        const otherBounceFactor = wall.hasBehavior(Bounce) ? wall.bounceFactor : 1;

        const bounceVelocity = bounceVector.clone().multiplyScalar(1 + circle.bounceFactor * otherBounceFactor);
        circle.velocity.add(bounceVelocity);
        entities.push(
            DebugVectorParticle(
                collision.closestPointOnLine.x,
                collision.closestPointOnLine.y,
                bounceVelocity,
                "purple"
            )
        );
        entities.push(DebugVectorParticle(circle.position.x, circle.position.y, circle.velocity, "cyan"));
    }
    const diff = circle.position.clone().subtract(collision.closestPointOnLine);
    const diffNormal = wall.normal.clone().multiplyScalar(-1);
    diff.subtract(diffNormal.clone().multiplyScalar(circle.radius * 1.01)).multiplyScalar(-1);

    circle.position.add(diff);
}

export const Bounce = buildBehavior({
    properties: () => ({
        ...Collidable.properties(),
        bounceFactor: 0.8,
        minAdditionalSpeed: 0,
    }),
    update(me) {
        for (const collision of me.collidingWith) {
            const entCollidingWith = collision.ent;
            if (me.hasBehavior(Kinematic) && me.hasBehavior(Circular)) {
                if (
                    entCollidingWith.hasBehavior(Circular) &&
                    (!entCollidingWith.hasBehavior(Flippy) || entCollidingWith.angularSpeed == 0)
                ) {
                    const AtB: Vector = me.position.clone().subtract(entCollidingWith.position);

                    const midPoint = AtB.clone().normalize().invert().multiplyScalar(entCollidingWith.radius);

                    const minDistance = entCollidingWith.radius + me.radius;

                    const tangent = new Vector(-AtB.y, AtB.x);

                    const existingVelocitySide = getSideOfVector(
                        me.position.clone().add(me.velocity),
                        midPoint,
                        midPoint.clone().add(tangent)
                    );

                    const normalSide = getSideOfVector(
                        entCollidingWith.position,
                        midPoint,
                        midPoint.clone().add(tangent)
                    );

                    if (existingVelocitySide === normalSide) {
                        const normalTangent = tangent.normalize();
                        const r2Length = normalTangent.dot(me.velocity);
                        const r2 = normalTangent.clone().multiplyScalar(r2Length);
                        const r1 = me.velocity.clone().subtract(r2);

                        const bounceVector = r1.clone().multiplyScalar(-1);
                        const otherBounceFactor = entCollidingWith.hasBehavior(Bounce)
                            ? entCollidingWith.bounceFactor
                            : 1;

                        const bounceVelocity = bounceVector
                            .clone()
                            .multiplyScalar(1 + me.bounceFactor * otherBounceFactor);
                        const otherMinSpeed = entCollidingWith.hasBehavior(Bounce)
                            ? entCollidingWith.minAdditionalSpeed
                            : 0;
                        bounceVelocity.add(bounceVector.clone().multiplyScalar(me.minAdditionalSpeed + otherMinSpeed));
                        me.velocity.add(bounceVelocity);

                        entities.push(
                            DebugVectorParticle(
                                entCollidingWith.position.x,
                                entCollidingWith.position.y,
                                bounceVelocity,
                                "green"
                            )
                        );
                    }

                    const diff = AtB.clone().normalize().multiplyScalar(minDistance).subtract(AtB);

                    me.position.add(diff);
                    return;
                }
            } else if (me.hasBehavior(Wall) || me.hasBehavior(LineSegment)) {
                if (entCollidingWith.hasBehavior(Kinematic) && entCollidingWith.hasBehavior(Circular)) {
                    resolveWallAndCircleCollision(me as any, entCollidingWith as any, collision);
                }
            }
        }
    },
});
