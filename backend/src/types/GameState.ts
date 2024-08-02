import { actionCards, epicTaleCards } from "./Card";
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
  winner: string;

  brenPickingCapital: boolean;

  placeInitialClans: boolean;
  placeClanTurn: string;
  totalInitialClansPlaced: number;

  isDrafting: boolean;
  cardsToDraft: number;

  isSeasonPhase: boolean;
  seasonPhasePlayerTurn: string;

  tiles: GameTile[];
};

export class GameState {
  id: string;
  privacy: GamePrivacy;

  tenSecondStartingCountdown: boolean = false;
  maxPlayers: number;
  setAsideCard?: string;
  players: { [playerId: string]: Player } = {};
  flockOfCrowsIsClockwise: boolean;
  bren: string = "";
  capitalTerritory: string = "";
  passCount: number = 0;

  hasStarted: boolean = false;
  winner: string = ""; //if not "" then some player has won the game

  brenPickingCapital: boolean = false;

  placeInitialClans: boolean = false;
  placeClanTurn: string = "";
  totalInitialClansPlaced: number = 0;

  isDrafting: boolean = false;
  cardsToDraft: number = 0;

  isSeasonPhase: boolean = false;
  seasonPhasePlayerTurn: string = "";

  tiles: GameTile[] = [];
  tileDeck: Tile[] = JSON.parse(
    JSON.stringify(Object.entries(allTiles).map(([_, tile]) => tile))
  );

  epicTaleCards: string[] = Object.values(epicTaleCards).map((card) => card.id);

  discardedActionCards: string[] = [];

  constructor(privacy: GamePrivacy, maxPlayers: number) {
    this.maxPlayers = maxPlayers;
    this.privacy = privacy;
    this.id = crypto.randomUUID();

    //shuffle decks of cards
    this.epicTaleCards = shuffle(this.epicTaleCards);

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
      winner: this.winner,
      brenPickingCapital: this.brenPickingCapital,

      placeInitialClans: this.placeInitialClans,
      placeClanTurn: this.placeClanTurn,
      totalInitialClansPlaced: this.totalInitialClansPlaced,

      isDrafting: this.isDrafting,
      cardsToDraft: this.cardsToDraft,

      isSeasonPhase: this.isSeasonPhase,
      seasonPhasePlayerTurn: this.seasonPhasePlayerTurn,
    };
  }

  dealActionCards() {
    const shuffledActionCards = shuffle(Object.values(actionCards).map((card) => card.id));
    this.setAsideCard = shuffledActionCards.pop();
    this.cardsToDraft = 1;

    while (shuffledActionCards.length > 0) {
      for (let playerId in this.players) {
        this.players[playerId].hand.push(shuffledActionCards.pop()!);
      }
    }
  }

  addStartingTiles() {
    //first starting tile
    const positions = [
      [
        { x: 0, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
      ],
      [
        { x: 2, y: -1 },
        { x: 3, y: -2 },
        { x: 2, y: -2 },
      ],
      [
        { x: 2, y: 0 },
        { x: 3, y: -1 },
        { x: 3, y: 0 },
      ],
      [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
      ],
    ];
    for (let i = 0; i < Object.keys(this.players).length; i++) {
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
  getPlayerColor(): string {
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
