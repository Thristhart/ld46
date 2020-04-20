import { Entity } from "@entities/entity";
import { entities } from "@global";
import Vector from "victor";
import { buildBehavior } from "./behavior";
import { Circular } from "./circular";
import { LineSegment } from "./lineSegment";
import { Wall } from "./wall";
import { Zone } from "./zone";

export type CollisionDescription =
    | {
          ent: Entity;
          type: "CircleAndWall";
          closestPointOnLine: Vector;
      }
    | {
          ent: Entity;
          type: "CircleAndCircle";
      }
    | {
          ent: Entity;
          type: "CircleAndZone";
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

function isCircleCollidingWithOrOutsideWall(ent: Entity<typeof Circular>, a: Vector, b: Vector, normal: Vector) {
    //P
    const p: Vector = ent.position.clone();

    const CP = findClosestPoint(a, b, p);

    const CPtP: Vector = p.clone().subtract(CP);

    const isOutsideWall = CPtP.clone()
        .normalize()
        .multiplyScalar(1000)
        .unfloat()
        .isEqualTo(normal.clone().multiplyScalar(1000).unfloat());

    const closestDistance = CP.distance(p);

    if (closestDistance < ent.radius || isOutsideWall) {
        return CP;
    }
    return undefined;
}

function isCircleCollidingWithOrOutsideLinesegment(ent: Entity<typeof Circular>, a: Vector, b: Vector, normal: Vector) {
    //P
    const p: Vector = ent.position.clone();

    const CP = findClosestPoint(a, b, p);

    const CPtP: Vector = p.clone().subtract(CP);

    const isOutsideWall = CPtP.clone()
        .normalize()
        .multiplyScalar(1000)
        .unfloat()
        .isEqualTo(normal.clone().multiplyScalar(1000).unfloat());

    const smallerX = Math.min(a.x, b.x);
    const biggerX = Math.max(a.x, b.x);
    const smallerY = Math.min(a.y, b.y);
    const biggerY = Math.max(a.y, b.y);

    const closestDistance = CP.distance(p);

    if (
        CP.x >= smallerX &&
        CP.x <= biggerX &&
        CP.y >= smallerY &&
        CP.y <= biggerY &&
        (closestDistance < ent.radius || isOutsideWall)
    ) {
        return CP;
    }
    return undefined;
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
                    const CP = isCircleCollidingWithOrOutsideWall(
                        me,
                        ent.position.clone(),
                        ent.endPoint.clone(),
                        ent.normal
                    );
                    if (CP) {
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
                } else if (ent.hasBehavior(Zone)) {
                    const leftSideDiff = ent.leftSideEnd.clone().subtract(ent.leftSideStart);
                    const leftSideNormal = new Vector(leftSideDiff.y, -leftSideDiff.x).normalize();

                    const rightSideDiff = ent.rightSideEnd.clone().subtract(ent.rightSideStart);
                    const rightSideNormal = new Vector(rightSideDiff.y, -rightSideDiff.x).normalize();
                    if (
                        isCircleCollidingWithOrOutsideLinesegment(
                            me,
                            ent.leftSideStart.clone(),
                            ent.leftSideEnd.clone(),
                            leftSideNormal
                        ) &&
                        isCircleCollidingWithOrOutsideLinesegment(
                            me,
                            ent.rightSideStart.clone(),
                            ent.rightSideEnd.clone(),
                            rightSideNormal
                        )
                    ) {
                        me.collidingWith.add({
                            ent,
                            type: "CircleAndZone",
                        });
                        ent.collidingWith.add({
                            ent: me,
                            type: "CircleAndZone",
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
                    const CP = isCircleCollidingWithOrOutsideWall(
                        ent,
                        me.position.clone(),
                        me.endPoint.clone(),
                        me.normal
                    );
                    if (CP) {
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
            } else if (me.hasBehavior(Zone)) {
                if (ent.hasBehavior(Circular)) {
                    const leftSideDiff = me.leftSideEnd.clone().subtract(me.leftSideStart);
                    const leftSideNormal = new Vector(leftSideDiff.y, -leftSideDiff.x).normalize();

                    const rightSideDiff = me.rightSideEnd.clone().subtract(me.rightSideStart);
                    const rightSideNormal = new Vector(rightSideDiff.y, -rightSideDiff.x).normalize();
                    if (
                        isCircleCollidingWithOrOutsideLinesegment(
                            ent,
                            me.leftSideStart.clone(),
                            me.leftSideEnd.clone(),
                            leftSideNormal
                        ) &&
                        isCircleCollidingWithOrOutsideLinesegment(
                            ent,
                            me.rightSideStart.clone(),
                            me.rightSideEnd.clone(),
                            rightSideNormal
                        )
                    ) {
                        me.collidingWith.add({
                            ent,
                            type: "CircleAndZone",
                        });
                        ent.collidingWith.add({
                            ent: me,
                            type: "CircleAndZone",
                        });
                    }
                }
            }
        });
    },
});
