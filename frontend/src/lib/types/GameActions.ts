import { api } from '$lib/util/api';

export type GameAction<T = object> = {
	type: GameActionType;
	gameId: string;
	playerJWT: string;
	data: T;
};

export type JoinGame = {
	name: string;
};

export type DraftCards = {
	cardsToKeep: string[]; //ids of cards you are keeping
};

type ChooseTerritory = {
	territory: string;
};

type PlayCard = {
	cardId: string;
};

type MoveClans = {
	from: string;
	to: string;
	numClans: number;
}[];

type AddClans = {
	territory: string;
	numClans: number;
}[];

type NewTile = {
	0: { x: number; y: number };
	1: { x: number; y: number };
	2: { x: number; y: number };
};

type NewAlliance = {
	territory: string;
	opponent: string;
};

type ChoosePlayer = {
  playerId: string
};

type ClashAttackResponse = {
  removeClan: boolean;
  removedCard: string;
}

export type WithdrawClans = {
  withdrawTerritory: string, 
  numClans: number
}[]

enum GameActionType {
	JoinGame,
	ViewGame,
	ReadyUp,
	UnreadyUp,
	DraftCards,
	ChooseCapitalTerritory,
	PlaceInitialClan,
	PlayCard,
	Pass,
	TakePretenderToken,
	ChooseClashingTerritory,
	ClashAttack,
	ClashAttackResponse,
	ClashResolveVote,
	ClashWithdraw,

	SanctuaryActionCard,
	CitadelActionCard,
	ConquestActionCard,
	CraftsmanAndPeasantsActionCard,
	DruidActionCard,
	ExplorationActionCard,
	FestivalActionCard,
	MigrationActionCard,
	NewAllianceActionCard,
	NewClansActionCard
}

export class GameActionFactory {
	static async joinGame(gameId: string, name: string): Promise<GameAction<JoinGame>> {
		return {
			type: GameActionType.JoinGame,
			gameId,
			playerJWT: await getJWT(),
			data: {
				name
			}
		};
	}

	static async viewGame(gameId: string): Promise<GameAction> {
		return {
			type: GameActionType.ViewGame,
			gameId,
			playerJWT: await getJWT(),
			data: {}
		};
	}

	static async readyUp(gameId: string): Promise<GameAction> {
		return {
			type: GameActionType.ReadyUp,
			gameId,
			playerJWT: await getJWT(),
			data: {}
		};
	}

	static async unreadyUp(gameId: string): Promise<GameAction> {
		return {
			type: GameActionType.UnreadyUp,
			gameId,
			playerJWT: await getJWT(),
			data: {}
		};
	}

	static async pickCapitalTerritory(
		gameId: string,
		territoryId: string
	): Promise<GameAction<ChooseTerritory>> {
		return {
			type: GameActionType.ChooseCapitalTerritory,
			gameId,
			playerJWT: await getJWT(),
			data: { territory: territoryId }
		};
	}

	static async placeInitialClan(
		gameId: string,
		territoryId: string
	): Promise<GameAction<ChooseTerritory>> {
		return {
			type: GameActionType.PlaceInitialClan,
			gameId,
			playerJWT: await getJWT(),
			data: { territory: territoryId }
		};
	}

	static async draftCards(gameId: string, cardsToKeep: string[]): Promise<GameAction<DraftCards>> {
		return {
			type: GameActionType.DraftCards,
			gameId,
			playerJWT: await getJWT(),
			data: {
				cardsToKeep: cardsToKeep
			}
		};
	}

	static async pass(gameId: string): Promise<GameAction> {
		return {
			type: GameActionType.Pass,
			gameId,
			playerJWT: await getJWT(),
			data: {}
		};
	}

	static async playCard(gameId: string, cardId: string): Promise<GameAction<PlayCard>> {
		return {
			type: GameActionType.PlayCard,
			gameId,
			playerJWT: await getJWT(),
			data: {
				cardId
			}
		};
	}

	static async takePretenderToken(gameId: string): Promise<GameAction> {
		return {
			type: GameActionType.TakePretenderToken,
			gameId,
			playerJWT: await getJWT(),
			data: {}
		};
	}

	static async chooseClashingTerritory(gameId: string, territoryId: string): Promise<GameAction<ChooseTerritory>> {
		return {
			type: GameActionType.ChooseClashingTerritory,
			gameId,
			playerJWT: await getJWT(),
			data: {
				territory: territoryId
			}
		};
	}

	static async clashAttack(gameId: string, attackedPlayerId: string): Promise<GameAction<ChoosePlayer>> {
		return {
			type: GameActionType.ClashAttack,
			gameId,
			playerJWT: await getJWT(),
			data: {
				playerId: attackedPlayerId
			}
		};
	}

	static async clashAttackResponse(gameId: string, removeClan: boolean, removedCard: string = ""): Promise<GameAction<ClashAttackResponse>> {
		return {
			type: GameActionType.ClashAttackResponse,
			gameId,
			playerJWT: await getJWT(),
			data: {
				removeClan: removeClan,
				removedCard: removedCard
			}
		};
	}

	static async clashResolveVote(gameId: string): Promise<GameAction> {
		return {
			type: GameActionType.ClashResolveVote,
			gameId,
			playerJWT: await getJWT(),
			data: {}
		};
	}

	static async clashWithdraw(gameId: string, withdrawClans: WithdrawClans) : Promise<GameAction<WithdrawClans>> {
		return {
			type: GameActionType.ClashWithdraw,
			gameId,
			playerJWT: await getJWT(),
			data: withdrawClans
		};
	}

	static async sanctuaryActionCard(
		gameId: string,
		tileId: string
	): Promise<GameAction<ChooseTerritory>> {
		return {
			type: GameActionType.SanctuaryActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: {
				territory: tileId
			}
		};
	}

	static async citadelActionCard(
		gameId: string,
		tileId: string
	): Promise<GameAction<ChooseTerritory>> {
		return {
			type: GameActionType.CitadelActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: {
				territory: tileId
			}
		};
	}

	static async conquestActionCard(
		gameId: string,
		clanMoves: MoveClans
	): Promise<GameAction<MoveClans>> {
		return {
			type: GameActionType.ConquestActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: clanMoves
		};
	}

	static async craftsmenAndPeasantsActionCard(
		gameId: string,
		addClans: AddClans
	): Promise<GameAction<AddClans>> {
		return {
			type: GameActionType.CraftsmanAndPeasantsActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: addClans
		};
	}

	static async druidActionCard(gameId: string, cardId: string): Promise<GameAction<PlayCard>> {
		return {
			type: GameActionType.DruidActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: { cardId: cardId }
		};
	}

	static async explorationActionCard(
		gameId: string,
		newTile: NewTile
	): Promise<GameAction<NewTile>> {
		return {
			type: GameActionType.ExplorationActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: newTile
		};
	}

	static async festivalActionCard(
		gameId: string,
		territoryId: string
	): Promise<GameAction<ChooseTerritory>> {
		return {
			type: GameActionType.FestivalActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: { territory: territoryId }
		};
	}

	static async migrationActionCard(
		gameId: string,
		clanMoves: MoveClans
	): Promise<GameAction<MoveClans>> {
		return {
			type: GameActionType.MigrationActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: clanMoves
		};
	}

	static async newAllianceActionCard(
		gameId: string,
		territory: string,
		opponent: string
	): Promise<GameAction<NewAlliance>> {
		return {
			type: GameActionType.NewAllianceActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: { territory, opponent }
		};
	}

	static async newClansActionCard(
		gameId: string,
		addClans: AddClans
	): Promise<GameAction<AddClans>> {
		return {
			type: GameActionType.NewClansActionCard,
			gameId,
			playerJWT: await getJWT(),
			data: addClans
		};
	}
}

async function getJWT(): Promise<string> {
	let jwt = localStorage.getItem('jwt');
	if (jwt !== null) {
		return jwt;
	}

	jwt = await api.getAuth();
	localStorage.setItem('jwt', jwt);
	return jwt;
}
