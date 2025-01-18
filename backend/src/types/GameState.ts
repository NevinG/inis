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
  currentlyPlayingTriskalCard: string;
  playerTurnForResolvingTriskal: string;

  geisAvailable: boolean;

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
  currentlyPlayingTriskalCard: string = ""; //id of triskal card currently playing
  playerTurnForResolvingTriskal: string = "";

  geisAvailable: boolean = false;

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
      currentlyPlayingTriskalCard: this.currentlyPlayingTriskalCard,
      playerTurnForResolvingTriskal: this.playerTurnForResolvingTriskal,

      geisAvailable: this.geisAvailable,

      discardedCards: this.currentlyPlayingCard == "5" && playerId == this.seasonPhasePlayerTurn ? this.discardedActionCards : [], //if druid is being played return discardedActionCards
    };
  }

  clone(): GameState {
    let clonedState = new GameState(this.privacy, this.maxPlayers);
    clonedState.id = this.id;
    clonedState.privacy = this.privacy;
    clonedState.tenSecondStartingCountdown = this.tenSecondStartingCountdown;
    clonedState.maxPlayers = this.maxPlayers;
    clonedState.setAsideCard = this.setAsideCard;
    clonedState.players = Object.fromEntries(Object.entries(this.players).map(([pid, player]) => [pid, player.clone()]));
    clonedState.flockOfCrowsIsClockwise = this.flockOfCrowsIsClockwise;
    clonedState.bren = this.bren;
    clonedState.capitalTerritory = this.capitalTerritory;
    clonedState.clashes = {
      instigatorId: this.clashes.instigatorId,
      territories: JSON.parse(JSON.stringify(this.clashes.territories)),
      currentlyResolvingTerritory: this.clashes.currentlyResolvingTerritory,
      citadelPlayerTurn: this.clashes.citadelPlayerTurn,
      citadelStageOver: this.clashes.citadelStageOver,
      donePlayingCitadels: JSON.parse(JSON.stringify(this.clashes.donePlayingCitadels)),
      citadel: JSON.parse(JSON.stringify(this.clashes.citadel)),
      votesToResolve: JSON.parse(JSON.stringify(this.clashes.votesToResolve)),
      playerTurn: this.clashes.playerTurn,
      attackedPlayer: this.clashes.attackedPlayer
    };
    clonedState.passCount = this.passCount;
    clonedState.hasStarted = this.hasStarted;
    clonedState.winner = this.winner;
    clonedState.brenPickingCapital = this.brenPickingCapital;
    clonedState.placeInitialClans = this.placeInitialClans;
    clonedState.placeClanTurn = this.placeClanTurn;
    clonedState.totalInitialClansPlaced = this.totalInitialClansPlaced;
    clonedState.isDrafting = this.isDrafting;
    clonedState.cardsToDraft = this.cardsToDraft;
    clonedState.isSeasonPhase = this.isSeasonPhase;
    clonedState.seasonPhasePlayerTurn = this.seasonPhasePlayerTurn;
    clonedState.currentlyPlayingCard = this.currentlyPlayingCard;
    clonedState.currentlyPlayingTriskalCard = this.currentlyPlayingCard;
    clonedState.playerTurnForResolvingTriskal = this.playerTurnForResolvingTriskal;
    clonedState.geisAvailable = this.geisAvailable;
    clonedState.tiles = JSON.parse(JSON.stringify(this.tiles));
    clonedState.tileDeck = JSON.parse(JSON.stringify(this.tileDeck));
    clonedState.epicTaleCards = JSON.parse(JSON.stringify(this.epicTaleCards));
    clonedState.discardedActionCards = JSON.parse(JSON.stringify(this.discardedActionCards));
    clonedState.discardedAdvantageCards = JSON.parse(JSON.stringify(this.discardedAdvantageCards));
    clonedState.discardedEpicTaleCards = JSON.parse(JSON.stringify(this.discardedEpicTaleCards));
    return clonedState;
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
