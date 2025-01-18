import { actionCards, advantageCards, epicTaleCards } from "./Card";

export type RestrictedPlayer = {
  id: string;
  name: string;
  ready: boolean;
  epicTaleCards: number;
  actionCards: number;
  advantageCards: number;
  hand: string[];
  triskalsAvailable: string[];
  reserveClans: number;
  deedCount: number;
  color: string;
  hasPretenderToken: boolean;
};

export class Player {
  id: string;
  socketId: string;
  name: string;
  ready: boolean = false;
  hand: string[] = [];
  triskalsAvailable: string[] = [];
  handForDraft: string[] = [];
  reserveClans: number = 12;
  deedCount: number = 0;
  color: string = "";
  hasPretenderToken: boolean = false;

  constructor(id: string, socketId: string, name: string) {
    this.id = id;
    this.socketId = socketId;
    this.name = name;
  }

  getPlayerInstance(playerId: string): RestrictedPlayer {
    return {
      id: this.id,
      name: this.name,
      ready: this.ready,
      reserveClans: this.reserveClans,
      deedCount: this.deedCount,
      epicTaleCards: this.hand.filter((cardId) => cardId in epicTaleCards)
        .length,
      actionCards: this.hand.filter((cardId) => cardId in actionCards)
        .length,
      advantageCards: this.hand.filter(
        (cardId) => (cardId in advantageCards)
      ).length,
      hand: this.id == playerId ? this.hand : [],
      triskalsAvailable: this.id == playerId ? this.triskalsAvailable : [],
      color: this.color,
      hasPretenderToken: this.hasPretenderToken,
    };
  }

  clone(): Player {
    const player = new Player(this.id, this.socketId, this.name);
    player.ready = this.ready;
    player.hand = [...this.hand];
    player.triskalsAvailable = [...this.triskalsAvailable];
    player.reserveClans = this.reserveClans;
    player.deedCount = this.deedCount;
    player.color = this.color;
    player.hasPretenderToken = this.hasPretenderToken;
    return player;
  }
}
