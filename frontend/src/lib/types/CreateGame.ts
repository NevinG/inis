import type { GamePrivacy } from './GameState';

export type CreateGame = {
	maxPlayers: number;
	privacy: GamePrivacy;
};
