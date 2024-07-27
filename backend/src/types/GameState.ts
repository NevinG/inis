import { actionCards, advantageCards, Card, epicTaleCards } from "./Card";
import { Player, RestrictedPlayer } from "./Player";
import { allTiles, Tile } from "./Tile";

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

  placedTiles: Record<string, Tile>;
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

  placedTiles: Record<string, Tile> = {};
  tileDeck: Tile[] = JSON.parse(JSON.stringify(allTiles));

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

    //shuffle tiles
    this.tileDeck = shuffle(this.tileDeck);
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

      placedTiles: this.placedTiles,

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

  addStartingTiles() {
    this.placedTiles[`0,0`] = this.tileDeck.pop()!;
    this.placedTiles[`1,0`] = this.tileDeck.pop()!;
    this.placedTiles[`1,-1`] = this.tileDeck.pop()!;
    this.placedTiles[`0,-1`] = this.tileDeck.pop()!;
    this.placedTiles[`-1,0`] = this.tileDeck.pop()!;
    this.placedTiles[`-1,1`] = this.tileDeck.pop()!;
    this.placedTiles[`0,1`] = this.tileDeck.pop()!;
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
