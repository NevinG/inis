import type { Player, RestrictedPlayer } from "./Player"

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
  tenSecondStartingCountdown: boolean;
  maxPlayers: number;
  players: { [playerId: string]: RestrictedPlayer };

  isDrafting: boolean;
  cardsToDraft: number;
};

export enum GamePrivacy { Public, Private } 