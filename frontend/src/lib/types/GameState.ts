import type { Player } from "./Player"

export type GameState = {
  id: string,
  privacy: GamePrivacy,
  hasStarted: boolean,
  players: {[playerId : string] : Player}
}

export enum GamePrivacy { Public, Private } 