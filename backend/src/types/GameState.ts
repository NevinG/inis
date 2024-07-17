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

export class GameState{
  id: string;
  privacy: GamePrivacy;
  hasStarted: boolean = false;
  maxPlayers: number;
  players: {[playerId : string] : Player} = {};

  constructor(privacy: GamePrivacy, maxPlayers: number){
    this.maxPlayers = maxPlayers;
    this.privacy = privacy;
    this.id = crypto.randomUUID();
  }

  getGameInstance(playerId: string): RestrictedGameState {
    return {
      id: this.id,
      playerId: playerId,
      privacy: this.privacy,
      hasStarted: this.hasStarted,
      maxPlayers: this.maxPlayers,
      players: this.players
    }
  }
}

export enum GamePrivacy { Public, Private } 