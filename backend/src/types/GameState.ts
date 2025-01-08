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
  clashes: {
    instigatorId: string, 
    territories: string[], 
    currentlyResolvingTerritory: string,
    citadelPlayerTurn: string,
    citadelStageOver: boolean,
    donePlayingCitadels: string[],
    citadel: {[playerId: string] : number}, 
    votesToResolve: {[playerId: string] : boolean},
    playerTurn: string, 
    attackedPlayer: string
  };

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
  currentlyPlayingCard: string;

  //extra info passed based on currentlyPlayingCard
  discardedCards: string[]; //for druid card

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
  clashes: {
    instigatorId: string, 
    territories: string[], 
    currentlyResolvingTerritory: string,
    citadelPlayerTurn: string,
    citadelStageOver: boolean,
    donePlayingCitadels: string[],
    citadel: {[playerId: string] : number}, 
    votesToResolve: {[playerId: string] : boolean},
    playerTurn: string, 
    attackedPlayer: string
  } = {
    instigatorId: "", 
    territories: [], 
    currentlyResolvingTerritory: "", 
    citadelPlayerTurn: "",
    citadelStageOver: false,
    donePlayingCitadels: [],
    citadel: {},
    votesToResolve: {},
    playerTurn: "", 
    attackedPlayer: ""
  };
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
  currentlyPlayingCard: string = ""; //id of card currently playing

  tiles: GameTile[] = [];
  tileDeck: Tile[] = JSON.parse(
    JSON.stringify(Object.entries(allTiles).map(([_, tile]) => tile))
  );

  epicTaleCards: string[] = Object.values(epicTaleCards).map((card) => card.id);

  discardedActionCards: string[] = [];
  discardedAdvantageCards: string[] = [];
  discardedEpicTaleCards: string[] = [];

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
      clashes: this.clashes,
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
      currentlyPlayingCard: this.currentlyPlayingCard,

      discardedCards:
        this.currentlyPlayingCard == "5" &&
        playerId == this.seasonPhasePlayerTurn
          ? this.discardedActionCards
          : [], //if druid is being played return discardedActionCards
    };
  }

  addClash(instigatorId: string, territory: string) {
    this.clashes.instigatorId = instigatorId;
    this.clashes.territories.push(territory);
    this.clashes.citadelPlayerTurn = this.getNextPlayer(instigatorId, [instigatorId]);

    if(this.tiles.find(tile => tile.tileId == territory)!.citadels == 0) {
      this.clashes.citadelStageOver = true;
    }

    //check for festival and remove clan if there is one there
    if(this.tiles.find(tile => tile.tileId == territory)?.festival) {
      this.tiles.find(tile => tile.tileId == territory)!.clans[instigatorId] = (this.tiles.find(tile => tile.tileId == territory)?.clans[instigatorId] ?? 0) - 1;
    }
    
    //find the first player with a clan in the territory to start placing citadels
    let i = 0//to be safe
    while(this.tiles.find(tile => tile.tileId == territory)?.clans[this.clashes.citadelPlayerTurn] ?? 0 == 0) {
      this.clashes.citadelPlayerTurn = this.getNextPlayer(this.clashes.citadelPlayerTurn, [instigatorId]);
      i++;
      if (i > 10)
        break;
    }
  }
  
  getNextPlayer(curPlayer: string, excludePlayers: string[]): string {
    let playerIds = Object.keys(this.players);
    let curIndex = playerIds.indexOf(curPlayer);
    let nextIndex = this.flockOfCrowsIsClockwise 
      ? (curIndex + 1) % playerIds.length 
      : (curIndex - 1 + playerIds.length) % playerIds.length;
    while (excludePlayers.includes(playerIds[nextIndex])) {
      nextIndex = this.flockOfCrowsIsClockwise 
        ? (nextIndex + 1) % playerIds.length 
        : (nextIndex - 1 + playerIds.length) % playerIds.length;
    }
    return playerIds[nextIndex];
  }
  

  dealActionCards() {
    const shuffledActionCards = shuffle(
      Object.values(actionCards).map((card) => card.id)
    );
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
        festival: false,
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
