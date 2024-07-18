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

enum GameActionType {
  JoinGame,
  ViewGame,
  ReadyUp,
  UnreadyUp
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