import { Entity } from "@entities/entity";
import { Behavior, buildBehavior } from "./behavior";

export const Circular = buildBehavior({
    properties: () => ({
        radius: 10,
    }),
});
