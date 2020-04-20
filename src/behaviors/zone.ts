import Vector from "victor";
import { buildBehavior } from "./behavior";

export const Zone = buildBehavior({
    properties: () => ({
        leftSideStart: new Vector(0, 0),
        leftSideEnd: new Vector(0, 0),
        rightSideStart: new Vector(0, 0),
        rightSideEnd: new Vector(0, 0),
    }),
});
