import { GamePrivacy, GameState, RestrictedGameState } from "../types/GameState";
import GameManager from "./GameManager";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

type GameAction = {
  type: GameActionType;
  gameId: string;
  playerJWT: string;
  data: object;
};

type JoinGame = {
  name: string;
};

enum GameActionType {
  JoinGame,
  ViewGame,
  Error,
}

export class SocketManager {
  static currentSockets: { [id: string]: WebSocket } = {};

  public static AddSocket(ws: WebSocket & { id: string }) {
    this.currentSockets[ws.id] = ws;
  }

  public static HandleMessage(
    socketId: string,
    message: string
  ): void {
    const gameAction = JSON.parse(message) as GameAction;
    //jwt verification
    let playerId: string = "";
    try {
      const jwtData  = jwt.verify(gameAction.playerJWT, process.env.TOKEN_SECRET as string) as JwtPayload;
      playerId = jwtData.id;
    } catch (e) {
      //remove connection
      this.currentSockets[socketId].close();
    }

    //make sure valid game id
    if(!GameManager.gameExists(gameAction.gameId)){
      return null!;
    }

    switch (gameAction.type) {
      case GameActionType.ViewGame:
        this.currentSockets[socketId].send(JSON.stringify(GameManager.getGame(playerId, gameAction.gameId)));
        break;

      case GameActionType.JoinGame:
        const joinGame = gameAction.data as JoinGame;
        GameManager.joinGame({
          id: playerId,
          socketId: socketId,
          name: joinGame.name,
        }, gameAction.gameId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        })
    }

    return null!;
  }
}
