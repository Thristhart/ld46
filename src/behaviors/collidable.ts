import { buildBehavior } from "./behavior";
import { Entity } from "@entities/entity";
import { entities } from "@global";
import { Circular } from "./circular";
import { Wall } from "./wall";
import Vector from "victor";
import { Kinematic } from "./kinematic";
import { LineSegment } from "./lineSegment";

export type CollisionDescription =
    | {
          ent: Entity;
          type: "CircleAndWall";
          closestPointOnLine: Vector;
      }
    | {
          ent: Entity;
          type: "CircleAndCircle";
      };

export function findClosestPoint(a: Vector, b: Vector, p: Vector) {
    //A->B
    const AtB: Vector = b.clone().subtract(a);
    //A->P
    const AtP: Vector = p.clone().subtract(a);

    const magAtBSq: number = a.distanceSq(b);

    const dotAtBwAtP = AtP.dot(AtB);

    const distanceAtoCP = dotAtBwAtP / magAtBSq;

    return a.clone().add(AtB.clone().multiplyScalar(distanceAtoCP));
}

export const Collidable = buildBehavior({
    properties: () => ({
        collidingWith: new Set<CollisionDescription>(),
    }),
    beforeUpdate(me) {
        me.collidingWith.clear();
    },
    update(me, dt) {
        entities.forEach((ent) => {
            // skip self
            if (ent === me) {
                return;
            }

            if (!ent.hasBehavior(Collidable)) {
                return;
            }

            if (me.hasBehavior(Circular)) {
                if (ent.hasBehavior(Circular)) {
                    const distance = me.position.distance(ent.position);
                    if (distance < me.radius + ent.radius) {
                        me.collidingWith.add({
                            ent,
                            type: "CircleAndCircle",
                        });
                        ent.collidingWith.add({
                            ent: me,
                            type: "CircleAndCircle",
                        });
                    }
                } else if (ent.hasBehavior(LineSegment)) {
                    //A
                    const a: Vector = ent.position.clone();
                    //B
                    const b: Vector = ent.endPoint.clone();
                    //P
                    const p: Vector = me.position.clone();

                    const CP = findClosestPoint(a, b, p);

                    const smallerX = Math.min(a.x, b.x);
                    const biggerX = Math.max(a.x, b.x);
                    const smallerY = Math.min(a.y, b.y);
                    const biggerY = Math.max(a.y, b.y);

                    const closestDistance = CP.distance(p);

                    if (
                        closestDistance < me.radius &&
                        CP.x >= smallerX &&
                        CP.x <= biggerX &&
                        CP.y >= smallerY &&
                        CP.y <= biggerY
                    ) {
                        me.collidingWith.add({
                            ent,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                        ent.collidingWith.add({
                            ent: me,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                    }
                } else if (ent.hasBehavior(Wall)) {
                    //A
                    const a: Vector = ent.position.clone();
                    //B
                    const b: Vector = ent.endPoint.clone();
                    //P
                    const p: Vector = me.position.clone();

                    const CP = findClosestPoint(a, b, p);

                    const CPtP: Vector = p.clone().subtract(CP);

                    const isOutsideWall = CPtP.clone()
                        .normalize()
                        .multiplyScalar(1000)
                        .unfloat()
                        .isEqualTo(ent.normal.clone().multiplyScalar(1000).unfloat());

                    const closestDistance = CP.distance(p);

                    if (closestDistance < me.radius || isOutsideWall) {
                        me.collidingWith.add({
                            ent,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                        ent.collidingWith.add({
                            ent: me,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                    }
                }
            } else if (me.hasBehavior(LineSegment)) {
                if (ent.hasBehavior(Circular)) {
                    //A
                    const a: Vector = me.position.clone();
                    //B
                    const b: Vector = me.endPoint.clone();
                    //P
                    const p: Vector = ent.position.clone();

                    const CP = findClosestPoint(a, b, p);

                    const smallerX = Math.min(a.x, b.x);
                    const biggerX = Math.max(a.x, b.x);
                    const smallerY = Math.min(a.y, b.y);
                    const biggerY = Math.max(a.y, b.y);

                    const closestDistance = CP.distance(p);

                    if (
                        closestDistance < ent.radius &&
                        CP.x >= smallerX &&
                        CP.x <= biggerX &&
                        CP.y >= smallerY &&
                        CP.y <= biggerY
                    ) {
                        me.collidingWith.add({
                            ent,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                        ent.collidingWith.add({
                            ent: me,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                    }
                }
            } else if (me.hasBehavior(Wall)) {
                if (ent.hasBehavior(Circular)) {
                    //A
                    const a: Vector = me.position.clone();
                    //B
                    const b: Vector = me.endPoint.clone();
                    //P
                    const p: Vector = ent.position.clone();

                    const CP = findClosestPoint(a, b, p);

                    const CPtP: Vector = p.clone().subtract(CP);

                    const isOutsideWall = CPtP.clone()
                        .normalize()
                        .multiplyScalar(1000)
                        .unfloat()
                        .isEqualTo(me.normal.clone().multiplyScalar(1000).unfloat());

                    const closestDistance = CP.distance(p);

                    if (closestDistance < ent.radius || isOutsideWall) {
                        me.collidingWith.add({
                            ent,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                        ent.collidingWith.add({
                            ent: me,
                            type: "CircleAndWall",
                            closestPointOnLine: CP,
                        });
                    }
                }
            }
        });
    },
});
