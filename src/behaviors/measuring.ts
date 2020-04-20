import { buildBehavior } from "./behavior";

export const Measuring = buildBehavior({
    properties: () => ({
        maximum: 1,
        currentValue: 0,
    }),
});
