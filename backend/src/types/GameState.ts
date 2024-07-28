import { actionCards, advantageCards, Card, epicTaleCards } from "./Card";
import { Player, RestrictedPlayer } from "./Player";
import { allTiles, GameTile, Tile } from "./Tile";

export type GamePreview = {
  id: string;
  currentPlayers: number;
  maxPlayers: number;
};

export type RestrictedGameState = {
  id: string;
  playerId: string;
  privacy: GamePrivacy;
  tenSecondStartingCountdown: boolean;
  maxPlayers: number;
  players: { [playerId: string]: RestrictedPlayer };
  flockOfCrowsIsClockwise: boolean;
  bren: string;
  capitalTerritory: string;

  hasStarted: boolean;
  brenPickingCapital: boolean;

  placeInitialClans:boolean;
  placeClanTurn: string;
  totalInitialClansPlaced: number;

  isDrafting: boolean;
  cardsToDraft: number;

  tiles: GameTile[];
};

export class GameState {
  id: string;
  privacy: GamePrivacy;

  tenSecondStartingCountdown: boolean = false;
  maxPlayers: number;
  setAsideCard?: Card;
  players: { [playerId: string]: Player } = {};
  flockOfCrowsIsClockwise: boolean;
  bren: string = "";
  capitalTerritory: string = "";

  hasStarted: boolean = false;
  brenPickingCapital: boolean = false;

  placeInitialClans:boolean = false;
  placeClanTurn: string = "";
  totalInitialClansPlaced: number = 0;

  isDrafting: boolean = false;
  cardsToDraft: number = 0;

  tiles: GameTile[] = [];
  tileDeck: Tile[] = JSON.parse(JSON.stringify(Object.entries(allTiles).map(([_, tile]) => tile)));

  actionCards: Card[] = JSON.parse(JSON.stringify(actionCards));
  epicTaleCards: Card[] = JSON.parse(JSON.stringify(epicTaleCards));
  advantageCards: Card[] = JSON.parse(JSON.stringify(advantageCards));

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

    //flip flock of crows
    this.flockOfCrowsIsClockwise = Math.random() < 0.5;
  }

  getGameInstance(playerId: string): RestrictedGameState {
    return {
      id: this.id,
      playerId: playerId,
      privacy: this.privacy,
      tenSecondStartingCountdown: this.tenSecondStartingCountdown,
      maxPlayers: this.maxPlayers,
      players: Object.fromEntries(
        Object.entries(this.players).map(([pid, player]) => {
          return [pid, player.getPlayerInstance(playerId)];
        })
      ),
      flockOfCrowsIsClockwise: this.flockOfCrowsIsClockwise,
      bren: this.bren,
      capitalTerritory: this.capitalTerritory,
      
      tiles: this.tiles,

      hasStarted: this.hasStarted,
      brenPickingCapital: this.brenPickingCapital,

      placeInitialClans: this.placeInitialClans,
      placeClanTurn: this.placeClanTurn,
      totalInitialClansPlaced: this.totalInitialClansPlaced,

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
    //first starting tile
    const positions = [
      [{x: 0, y: 0},{x: 1, y: -1},{x: 1, y: 0}],
      [{x: 2, y: -1},{x: 3, y: -2},{x: 2, y: -2}],
      [{x: 2, y: 0},{x: 3, y: -1},{x: 3, y: 0}],
      [{x: 1, y: 1},{x: 2, y: 1},{x: 1, y: 2}],
    ]
    for(let i = 0; i < Object.keys(this.players).length; i++) {
      this.tiles.push({
        tileId: this.tileDeck.pop()?.id!, 
        positions: positions.pop()!,
        clans: {},
        sanctuaries: 0,
        citadels: 0,
      });
    }
  }

  colors: [string, string, string, string] = ["red", "blue", "green", "pink"];
  getPlayerColor() : string {
    return this.colors.pop() ?? "black"; //should never be black
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
