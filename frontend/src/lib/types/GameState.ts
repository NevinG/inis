import type { RestrictedPlayer } from "./Player"
import type { Tile } from "./Tile";

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
  flockOfCrowsIsClockwise: boolean;
  
  isDrafting: boolean;
  cardsToDraft: number;

  tiles: {tile: Tile, positions: {x: number, y: number}[]}[];
};

export enum GamePrivacy { Public, Private } 