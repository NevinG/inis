import {
  GamePreview,
  GamePrivacy,
  GameState,
  RestrictedGameState,
} from "../types/GameState";
import { Player } from "../types/Player";
import { SocketManager } from "./SocketManager";

export default class GameManager {
  static currentGames: { [gameId: string]: GameState } = {};

  public static createGame(privacy: GamePrivacy, maxPlayers: number): string {
    const newGame = new GameState(privacy, maxPlayers);
    this.currentGames[newGame.id] = newGame;
    return newGame.id;
  }

  public static getGames(): GamePreview[] {
    return Object.keys(this.currentGames)
      .map((key) => this.currentGames[key])
      .filter((game) => game.privacy === GamePrivacy.Public)
      .map((game) => {
        return {
          id: game.id,
          currentPlayers: Object.keys(game.players).length,
          maxPlayers: game.maxPlayers,
        };
      });
  }

  public static gameExists(id: string): boolean {
    return id in this.currentGames;
  }

  public static getGame(playerId: string, id: string): RestrictedGameState {
    return this.currentGames[id].getGameInstance(playerId);
  }

  public static joinGame(
    player: Player,
    gameId: string
  ): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //check if user is already in game
    if (player.id in game.players) {
      return [[player.socketId, game.getGameInstance(player.id)]];
    }
    //check if game is full
    if (Object.keys(game.players).length >= game.maxPlayers) {
      return [[player.socketId, game.getGameInstance(player.id)]];
    }
    game.players[player.id] = player;
    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static readyUp(
    playerId: string,
    gameId: string
  ): [string, RestrictedGameState][] {
    this.currentGames[gameId].players[playerId].ready = true;
    const game = this.currentGames[gameId];

    this.checkIfAllReady(gameId);

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static unreadyUp(
    playerId: string,
    gameId: string
  ): [string, RestrictedGameState][] {
    this.currentGames[gameId].players[playerId].ready = false;
    const game = this.currentGames[gameId];

    this.checkIfAllReady(gameId);

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  private static checkIfAllReady(gameId: string): void {
    const game = this.currentGames[gameId];
    if (Object.keys(game.players).every(
      (playerId) => game.players[playerId].ready
    ) && Object.keys(game.players).length > 1) {
      game.tenSecondStartingCountdown = true;
      setTimeout(() => {
        if(game.tenSecondStartingCountdown)
          game.hasStarted = true;
        game.tenSecondStartingCountdown = false;

        //update all players with started game
        Object.keys(game.players).forEach((playerId) => {
          SocketManager.currentSockets[game.players[playerId].socketId].send(JSON.stringify(game.getGameInstance(playerId)));
        });
      }, 10 * 1000)
    }else {
      game.tenSecondStartingCountdown = false;
    }
  }
}
