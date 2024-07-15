import { GamePrivacy } from "./GameState"

export type CreateGame = {
  players: number,
  privacy: GamePrivacy
}