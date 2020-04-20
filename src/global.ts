import { Entity } from "./entities/entity";

export const entities: Entity[] = [];

export const defaultFlipperSpeedMultiplier = 400;

//@ts-ignore
window.debug = { entities };

export enum GamePhase {
    Intro,
    Standard,
    Died,
    GameOver,
    Victory,
}
export const GameState = {
    phase: GamePhase.Intro,
    timeOnCurrentPhase: 0,
};
