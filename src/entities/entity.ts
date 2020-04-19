import { Behavior } from "@behaviors/behavior";
import Vector from "victor";

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type Entity<Behaviors extends Behavior = Behavior> = {
    [K in keyof UnionToIntersection<ReturnType<Behaviors["properties"]>>]: UnionToIntersection<
        ReturnType<Behaviors["properties"]>
    >[K];
} &
    InherentEntityProperties<Behaviors> & {
        behaviors: Behaviors[];
        draw(context: CanvasRenderingContext2D): void;
        update(dt: number): void;
        init(entity: Entity<Behaviors>): void;
    };

interface InherentEntityProperties<Behaviors extends Behavior> {
    position: Vector;
    x: number;
    y: number;
    hasBehavior<BehaviorCheck extends Behaviors>(behavior: BehaviorCheck): this is Entity<BehaviorCheck | Behaviors>;
}
export interface EntityDescription<Behaviors extends Behavior, InitParams extends any[]> {
    behaviors: Behaviors[];
    draw?(entity: Entity<Behaviors>, context: CanvasRenderingContext2D): void;
    update?(entity: Entity<Behaviors>, dt: number): void;
    init?(entity: Entity<Behaviors>, ...args: InitParams): void;
}

export function buildEntity<Behaviors extends Behavior, InitParams extends any[]>({
    behaviors,
    draw,
    update,
    init,
}: EntityDescription<Behaviors, InitParams>) {
    return (x: number, y: number, ...initParams: InitParams): Entity<Behaviors> => {
        const entity = {
            behaviors,
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
        };
        behaviors.forEach((behavior) => {
            Object.assign(entity, behavior.properties());
            return entity;
        });

        entity.init();

        return (entity as unknown) as Entity<Behaviors>;
    };
}
