import type { GamePrivacy } from "./GameState"

export type CreateGame = {
  players: number,
  privacy: GamePrivacy
}