import type { Player } from "./Player"

export type GamePreview = {
  id: string;
  currentPlayers: number;
  maxPlayers: number;
}

export type RestrictedGameState = {
  id: string;
  playerId: string;
  privacy: GamePrivacy;
  hasStarted: boolean;
  maxPlayers: number;
  players: {[playerId : string] : Player};
}

export enum GamePrivacy { Public, Private } 