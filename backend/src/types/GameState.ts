import { actionCards, advantageCards, Card, epicTaleCards } from "./Card";
import { Player, RestrictedPlayer } from "./Player";

export type GamePreview = {
  id: string;
  currentPlayers: number;
  maxPlayers: number;
};

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

export class GameState {
  id: string;
  privacy: GamePrivacy;
  hasStarted: boolean = false;
  tenSecondStartingCountdown: boolean = false;
  maxPlayers: number;
  setAsideCard?: Card;
  players: { [playerId: string]: Player } = {};

  isDrafting: boolean = false;
  cardsToDraft: number = 0;

  actionCards: Card[] = JSON.parse(JSON.stringify(actionCards));
  epicTaleCards: Card[] = JSON.parse(JSON.stringify(epicTaleCards));
  advantageCards: Card[] = JSON.parse(JSON.stringify(actionCards));

  constructor(privacy: GamePrivacy, maxPlayers: number) {
    this.maxPlayers = maxPlayers;
    this.privacy = privacy;
    this.id = crypto.randomUUID();

    //shuffle decks of cards
    this.actionCards = shuffle(this.actionCards);
    this.epicTaleCards = shuffle(this.epicTaleCards);
    this.setAsideCard = this.actionCards.pop();
  }

  getGameInstance(playerId: string): RestrictedGameState {
    return {
      id: this.id,
      playerId: playerId,
      privacy: this.privacy,
      hasStarted: this.hasStarted,
      tenSecondStartingCountdown: this.tenSecondStartingCountdown,
      maxPlayers: this.maxPlayers,
      players: Object.fromEntries(
        Object.entries(this.players).map(([pid, player]) => {
          return [pid, player.getPlayerInstance(playerId)];
        })
      ),

      isDrafting: this.isDrafting,
      cardsToDraft: this.cardsToDraft,
    };
  }

  dealActionCards() {
    this.actionCards = shuffle(JSON.parse(JSON.stringify(this.actionCards)));
    while (this.actionCards.length > 0) {
      for (let playerId in this.players) {
        this.players[playerId].hand.push(this.actionCards.pop()!);
      }
    }
  }
}

export enum GamePrivacy {
  Public,
  Private,
}

function shuffle(array: any[]): any[] {
  let newArray = [];
  while (array.length > 0) {
    let randomIndex = Math.floor(Math.random() * array.length);
    newArray.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return newArray;
}
