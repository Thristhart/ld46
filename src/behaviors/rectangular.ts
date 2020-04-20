import { buildBehavior } from "./behavior";

export const Rectangular = buildBehavior({
    properties: () => ({
        width: 100,
        height: 100,
    }),
});
