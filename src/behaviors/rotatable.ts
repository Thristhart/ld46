import { buildBehavior } from "./behavior";

export const Rotatable = buildBehavior({
    properties: () => ({
        angle: 0,
    }),
});
