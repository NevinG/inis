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

  public static draftCards(
    playerId: string,
    gameId: string,
    cards: string[]
  ): [string, RestrictedGameState][] {
    const newHand = this.currentGames[gameId].players[playerId].hand.filter(
      (card) => cards.indexOf(card.id) != -1
    );
    const giveInDraft = this.currentGames[gameId].players[playerId].hand.filter(
      (card) => cards.indexOf(card.id) == -1
    );
    this.currentGames[gameId].players[playerId].hand = newHand;
    this.currentGames[gameId].players[playerId].handForDraft = giveInDraft;
    const game = this.currentGames[gameId];

    //check if all players are done drafting for round
    if (
      Object.entries(game.players).every(
        ([_, player]) => player.handForDraft.length > 0
      )
    ) {
      //pass cards to next player
      const playerKeys = Object.keys(game.players);
      Object.entries(game.players).forEach(([_, player], i) => {
        game.players[playerKeys[(i + 1) % playerKeys.length]].hand.push(...player.handForDraft);
        player.handForDraft = [];
      });

      //increment cards to draft for next drafting round
      game.cardsToDraft++;

      //check if drafting is over
      if (game.players[Object.keys(game.players)[0]].hand.length == game.cardsToDraft) {
        game.isDrafting = false;
        game.cardsToDraft = 1;
      }
    }

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  private static checkIfAllReady(gameId: string): void {
    const game = this.currentGames[gameId];
    if (
      Object.keys(game.players).every(
        (playerId) => game.players[playerId].ready
      ) &&
      Object.keys(game.players).length > 1
    ) {
      game.tenSecondStartingCountdown = true;
      setTimeout(() => {
        if (game.tenSecondStartingCountdown) {
          this.startGame(gameId);
        }
        game.tenSecondStartingCountdown = false;
      }, 10 * 1000);
    } else {
      game.tenSecondStartingCountdown = false;
    }
  }

  private static startGame(gameId: string): void {
    const game = this.currentGames[gameId];
    game.hasStarted = true;
    game.tenSecondStartingCountdown = false;
    //deal cards
    game.dealActionCards();
    //start drafting
    game.isDrafting = true;
    game.cardsToDraft = 1;
    //tiles
    game.addStartingTiles();
    //pick bren
    game.bren = Object.keys(game.players)[
      Math.floor(Math.random() * Object.keys(game.players).length)
    ];

    //send game state to all players
    Object.keys(game.players).forEach((playerId) => {
      SocketManager.currentSockets[game.players[playerId].socketId].send(
        JSON.stringify(game.getGameInstance(playerId))
      );
    });
  }
}
