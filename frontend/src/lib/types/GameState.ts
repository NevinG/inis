import type { RestrictedPlayer } from './Player';
import type { GameTile } from './Tile';

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

export enum GamePrivacy {
	Public,
	Private
}
