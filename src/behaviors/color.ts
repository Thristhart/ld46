import { buildBehavior } from "./behavior";

export const Color = buildBehavior({
    properties: () => ({
        color: "red",
    }),
});
