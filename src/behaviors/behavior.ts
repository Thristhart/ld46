import { Entity } from "@entities/entity";

export type Behavior<Properties = {}> = {
    beforeUpdate(entity: Entity): void;
    update(entity: Entity, dt: number): void;
    init(entity: Entity): void;
    cleanup(entity: Entity): void;
    properties(): Properties;
};

export function buildBehavior<
    Properties,
    DependencyProperties = never,
    CombinedProps = Properties | DependencyProperties
>({
    properties,
    dependencies,
    update,
    init,
    beforeUpdate,
    cleanup,
}: {
    properties: () => Properties;
    dependencies?: Behavior<DependencyProperties>[];
    beforeUpdate?: (entity: Entity<Behavior<CombinedProps>>) => void;
    update?: (entity: Entity<Behavior<CombinedProps>>, dt: number) => void;
    init?: (entity: Entity<Behavior<CombinedProps>>) => void;
    cleanup?: (entity: Entity<Behavior<CombinedProps>>) => void;
}): Behavior<Properties | DependencyProperties> {
    const behavior = {
        properties,
        dependencies,
        update(entity: Entity<Behavior<CombinedProps>>, dt: number) {
            if (update) {
                update(entity, dt);
            }
        },
        beforeUpdate(entity: Entity<Behavior<CombinedProps>>) {
            if (beforeUpdate) {
                beforeUpdate(entity);
            }
        },
        init(entity: Entity<Behavior<CombinedProps>>) {
            if (init) {
                init(entity);
            }
        },
        cleanup(entity: Entity<Behavior<CombinedProps>>) {
            if (cleanup) {
                cleanup(entity);
            }
        },
    };

    return behavior;
}
