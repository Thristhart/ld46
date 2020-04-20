import { Entity } from "@entities/entity";
import Vector from "victor";
import { buildBehavior } from "./behavior";
import { Bounce } from "./bounce";
import { Circular } from "./circular";
import { Collidable, CollisionDescription } from "./collidable";
import { Kinematic } from "./kinematic";
import { LineSegment } from "./lineSegment";
import { Wall } from "./wall";

function resolveWallAndCircleCollision(
    wall: Entity<typeof Wall | typeof LineSegment | typeof Bounce>,
    circle: Entity<typeof Kinematic | typeof Circular | typeof Bounce>,
    collision: CollisionDescription
) {
    if (collision.type !== "CircleAndWall") {
        return;
    }
    const diff = circle.position.clone().subtract(collision.closestPointOnLine);
    const diffNormal = wall.normal.clone().multiplyScalar(-1);
    diff.subtract(diffNormal.clone().multiplyScalar(circle.radius * 1.01)).multiplyScalar(-1);

    circle.position.add(diff);
}

export const Solid = buildBehavior({
    properties: () => ({
        isSolid: true,
    }),
    dependencies: [Collidable],
    update(me) {
        if (!me.isSolid) {
            return;
        }
        for (const collision of me.collidingWith) {
            const entCollidingWith = collision.ent;
            if (!entCollidingWith.hasBehavior(Solid)) {
                return;
            }
            if (me.hasBehavior(Kinematic) && me.hasBehavior(Circular)) {
                if (entCollidingWith.hasBehavior(Circular)) {
                    const AtB: Vector = me.position.clone().subtract(entCollidingWith.position);

                    const minDistance = entCollidingWith.radius + me.radius;
                    const diff = AtB.clone().normalize().multiplyScalar(minDistance).subtract(AtB);

                    me.position.add(diff);
                }
            } else if (me.hasBehavior(Wall) || me.hasBehavior(LineSegment)) {
                if (entCollidingWith.hasBehavior(Kinematic) && entCollidingWith.hasBehavior(Circular)) {
                    resolveWallAndCircleCollision(me as any, entCollidingWith as any, collision);
                }
            }
        }
    },
});
