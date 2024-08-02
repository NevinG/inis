import { actionCards, advantageCards, epicTaleCards } from "./Card";

export type RestrictedPlayer = {
  id: string;
  name: string;
  ready: boolean;
  epicTaleCards: number;
  actionCards: number;
  advantageCards: number;
  hand: string[];
  reserveClans: number;
  color: string;
  hasPretenderToken: boolean;
};

export class Player {
  id: string;
  socketId: string;
  name: string;
  ready: boolean = false;
  hand: string[] = [];
  handForDraft: string[] = [];
  reserveClans: number = 12;
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
      epicTaleCards: this.hand.filter((cardId) => cardId in epicTaleCards)
        .length,
      actionCards: this.hand.filter((cardId) => cardId in actionCards)
        .length,
      advantageCards: this.hand.filter(
        (cardId) => (cardId in advantageCards)
      ).length,
      hand: this.id == playerId ? this.hand : [],
      color: this.color,
      hasPretenderToken: this.hasPretenderToken,
    };
  }
}
