import { api } from "$lib/util/api";

export type GameAction<T> = {
  type: GameActionType;
  gameId: string;
  playerJWT: string;
  data: T;
}

export type JoinGame = {
  name: string;
}

export type DraftCards = {
  cardsToKeep: string[] //ids of cards you are keeping
}

type ChooseTerritory = {
  territory: string;
};

enum GameActionType {
  JoinGame,
  ViewGame,
  ReadyUp,
  UnreadyUp,
  DraftCards,
  ChooseCapitalTerritory,
  PlaceInitialClan,
}

export class GameActionFactory {
  static async joinGame(gameId: string, name: string): Promise<GameAction<JoinGame>>{
    return {
      type: GameActionType.JoinGame,
      gameId,
      playerJWT: await getJWT(),
      data: {
        name,
      }
    }
  }

  static async viewGame(gameId: string): Promise<GameAction<{}>>{
    return {
      type: GameActionType.ViewGame,
      gameId,
      playerJWT: await getJWT(),
      data: {},
    };
  }

  static async readyUp(gameId: string): Promise<GameAction<{}>>{
    return {
      type: GameActionType.ReadyUp,
      gameId,
      playerJWT: await getJWT(),
      data: {},
    };
  }

  static async unreadyUp(gameId: string): Promise<GameAction<{}>>{
    return {
      type: GameActionType.UnreadyUp,
      gameId,
      playerJWT: await getJWT(),
      data: {},
    };
  }

  static async pickCapitalTerritory(gameId: string, territoryId: string): Promise<GameAction<ChooseTerritory>>{
    return {
      type: GameActionType.ChooseCapitalTerritory,
      gameId,
      playerJWT: await getJWT(),
      data: {territory: territoryId},
    };
  }

  static async placeInitialClan(gameId: string, territoryId: string): Promise<GameAction<ChooseTerritory>>{
    return {
      type: GameActionType.PlaceInitialClan,
      gameId,
      playerJWT: await getJWT(),
      data: {territory: territoryId},
    };
  }

  static async draftCards(gameId: string, cardsToKeep: string[]): Promise<GameAction<DraftCards>>{
    return {
      type: GameActionType.DraftCards,
      gameId,
      playerJWT: await getJWT(),
      data: {
        cardsToKeep: cardsToKeep
      },
    };
  }
}

async function getJWT() : Promise<string> {
  let jwt = localStorage.getItem('jwt');
  if(jwt !== null) {
    return jwt;
  }

  jwt = await api.getAuth();
  localStorage.setItem('jwt', jwt);
  return jwt;
}