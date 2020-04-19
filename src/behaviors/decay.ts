import { buildBehavior } from "./behavior";
import { entities } from "@global";

export const Decay = buildBehavior({
    properties: () => ({ duration: 30, timeAlive: 0 }),
    update(entity, dt) {
        entity.timeAlive += dt;
        if (entity.timeAlive > entity.duration) {
            entities.splice(entities.indexOf(entity), 1);
        }
    },
});
