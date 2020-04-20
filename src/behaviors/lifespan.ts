import { buildBehavior } from "./behavior";

export const Lifespan = buildBehavior({
    properties: () => ({
        timeAlive: 0,
    }),
    update(entity, dt) {
        entity.timeAlive += dt;
    },
});
