import type { Player } from "./Player"

export class GameState{
  id: string;
  privacy: GamePrivacy;
  hasStarted: boolean = false;
  players: {[playerId : string] : Player} = {};

  constructor(privacy: GamePrivacy){
    this.privacy = privacy;
    this.id = crypto.randomUUID();
  }
}

export enum GamePrivacy { Public, Private } 