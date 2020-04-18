import { Entity } from "@entities/entity";

export type Behavior<Properties = any> = {
    update(entity: Entity, dt: number): void;
    properties: Properties;
};

export function buildBehavior<Properties>(
    properties: Properties,
    update?: (entity: Entity<Behavior<Properties>>, dt: number) => void
): Behavior<Properties> {
    return {
        properties,
        update(entity: Entity<Behavior<Properties>>, dt: number) {
            if (update) {
                update(entity, dt);
            }
        },
    };
}
