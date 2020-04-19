import { Entity } from "@entities/entity";

export type Behavior<Properties = Object> = {
    beforeUpdate(entity: Entity): void;
    update(entity: Entity, dt: number): void;
    init(entity: Entity): void;
    properties(): Properties;
};

export function buildBehavior<Properties>({
    properties,
    update,
    init,
    beforeUpdate,
}: {
    properties: () => Properties;
    beforeUpdate?: (entity: Entity<Behavior<Object | Properties>>) => void;
    update?: (entity: Entity<Behavior<Object | Properties>>, dt: number) => void;
    init?: (entity: Entity<Behavior<Object | Properties>>) => void;
}): Behavior<Properties> {
    const behavior = {
        properties,
        update(entity: Entity<Behavior<Object | Properties>>, dt: number) {
            if (update) {
                update(entity, dt);
            }
        },
        beforeUpdate(entity: Entity<Behavior<Object | Properties>>) {
            if (beforeUpdate) {
                beforeUpdate(entity);
            }
        },
        init(entity: Entity<Behavior<Object | Properties>>) {
            if (init) {
                init(entity);
            }
        },
    };

    return behavior;
}
