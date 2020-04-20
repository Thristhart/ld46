import { Behavior } from "@behaviors/behavior";
import { entities } from "@global";
import Vector from "victor";

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type BehaviorProperties<BehaviorToExtractFrom extends Behavior> = ReturnType<BehaviorToExtractFrom["properties"]>;

export type Entity<Behaviors extends Behavior = Behavior> = {
    [K in keyof UnionToIntersection<BehaviorProperties<Behaviors>>]: UnionToIntersection<
        BehaviorProperties<Behaviors>
    >[K];
} &
    InherentEntityProperties<Behaviors> & {
        behaviors: Behaviors[];
        draw(context: CanvasRenderingContext2D): void;
        update(dt: number): void;
        init(entity: Entity<Behaviors>): void;
    };

interface InherentEntityProperties<Behaviors> {
    position: Vector;
    x: number;
    y: number;
    hasBehavior<BehaviorCheck extends Behavior>(behavior: BehaviorCheck): this is Entity<BehaviorCheck>;
    remove(): void;
}
export interface EntityDescription<Behaviors extends Behavior, InitParams extends any[]> {
    behaviors: Behaviors[];
    draw?(entity: Entity<Behaviors>, context: CanvasRenderingContext2D): void;
    update?(entity: Entity<Behaviors>, dt: number): void;
    init?(entity: Entity<Behaviors>, ...args: InitParams): void;
}

function navigateDependencyTree(rootBehavior: Behavior, behaviorSet: Set<Behavior>) {
    behaviorSet.add(rootBehavior);
    const root = (rootBehavior as unknown) as { dependencies: Behavior[] | undefined };
    root.dependencies &&
        root.dependencies.forEach((dep) => {
            navigateDependencyTree(dep, behaviorSet);
        });
}

export function buildEntity<Behaviors extends Behavior, InitParams extends any[]>({
    behaviors,
    draw,
    update,
    init,
}: EntityDescription<Behaviors, InitParams>) {
    return (x: number, y: number, ...initParams: InitParams): Entity<Behaviors> => {
        const behaviorSet = new Set<Behavior>();
        for (const behavior of behaviors) {
            navigateDependencyTree(behavior, behaviorSet);
        }
        const entity = {
            behaviors: Array.from(behaviorSet),
            position: new Vector(x, y),

            get x() {
                return this.position.x;
            },
            get y() {
                return this.position.y;
            },
            set x(x) {
                this.position.x = x;
            },
            set y(y) {
                this.position.y = y;
            },

            update(dt: number) {
                entity.behaviors.forEach((behavior) => {
                    behavior.update(entity as any, dt);
                });
                if (update) {
                    update(entity as any, dt);
                }
            },

            draw(context: CanvasRenderingContext2D) {
                if (draw) {
                    draw(entity as any, context);
                }
            },

            init() {
                if (init) {
                    init(entity as any, ...initParams);
                }
                entity.behaviors.forEach((behavior) => {
                    behavior.init(entity as any);
                });
            },

            hasBehavior(behavior: Behaviors): boolean {
                return this.behaviors.includes(behavior);
            },

            remove() {
                entity.behaviors.forEach((behavior) => {
                    behavior.cleanup(entity as any);
                });
                entities.splice(entities.indexOf(entity as any), 1);
            },
        };
        behaviorSet.forEach((behavior) => {
            Object.assign(entity, behavior.properties());
            return entity;
        });

        entity.init();

        return (entity as unknown) as Entity<Behaviors>;
    };
}
