import { Card, CardType } from "./Card";

export type RestrictedPlayer = {
  id: string;
  name: string;
  ready: boolean;
  epicTaleCards: number;
  actionCards: number;
  advantageCards: number;
  hand: Card[];
};

export class Player {
  id: string;
  socketId: string;
  name: string;
  ready: boolean = false;
  hand: Card[] = [];
  handForDraft : Card[] = [];

  constructor(id: string, socketId: string, name: string) {
    this.id = id;
    this.socketId = socketId;
    this.name = name;
  }

  getPlayerInstance(playerId : string): RestrictedPlayer {
    return {
      id: this.id,
      name: this.name,
      ready: this.ready,
      epicTaleCards: this.hand.filter((card) => card.type == CardType.EpicTale)
        .length,
      actionCards: this.hand.filter((card) => card.type == CardType.Action)
        .length,
      advantageCards: this.hand.filter(
        (card) => card.type == CardType.Advantage
      ).length,
      hand: this.id == playerId ? this.hand : [],
    };
  }
}
