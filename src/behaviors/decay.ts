import { buildBehavior } from "./behavior";
import { Lifespan } from "./lifespan";

export const Decay = buildBehavior({
    dependencies: [Lifespan],
    properties: () => ({ duration: 30 }),
    update(entity) {
        if (entity.timeAlive > entity.duration) {
            entity.remove();
        }
    },
});
