import { actionCards, advantageCards, epicTaleCards } from "../types/Card";
import {
  GamePreview,
  GamePrivacy,
  GameState,
  RestrictedGameState,
} from "../types/GameState";
import { Player } from "../types/Player";
import { allTiles, GameTile } from "../types/Tile";
import { NewTile, SocketManager } from "./SocketManager";

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
    //add color to game
    game.players[player.id] = player;
    player.color = game.getPlayerColor();
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
      (cardId) => cards.indexOf(cardId) != -1 || !(cardId in actionCards)
    );
    const giveInDraft = this.currentGames[gameId].players[playerId].hand.filter(
      (cardId) => !(cards.indexOf(cardId) != -1 || !(cardId in actionCards))
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
        game.players[playerKeys[(i + 1) % playerKeys.length]].hand.push(
          ...player.handForDraft
        );
        player.handForDraft = [];
      });

      //increment cards to draft for next drafting round
      game.cardsToDraft++;

      //check if drafting is over
      if (
        game.players[Object.keys(game.players)[0]].hand.filter(card => card in actionCards).length ==
        game.cardsToDraft
      ) {
        game.isDrafting = false;

        //start the season phase
        game.isSeasonPhase = true;
        game.seasonPhasePlayerTurn = game.bren;
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

    //tiles
    game.addStartingTiles();
    //pick bren
    game.bren = Object.keys(game.players)[
      Math.floor(Math.random() * Object.keys(game.players).length)
    ];
    //bren picks capital
    game.brenPickingCapital = true;

    //send game state to all players
    Object.keys(game.players).forEach((playerId) => {
      SocketManager.currentSockets[game.players[playerId].socketId].send(
        JSON.stringify(game.getGameInstance(playerId))
      );
    });
  }

  public static chooseCapitalTerritory(
    gameId: string,
    territoryId: string
  ): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    game.brenPickingCapital = false;
    game.capitalTerritory = territoryId;
    game.tiles.find((tile) => tile.tileId == territoryId)!.citadels++;
    game.tiles.find((tile) => tile.tileId == territoryId)!.sanctuaries++;

    //start placing initital clans
    game.placeInitialClans = true;
    game.placeClanTurn = game.bren;

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static placeInitialClan(
    gameId: string,
    territoryId: string,
    playerId: string
  ): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    const tile = game.tiles.find((tile) => tile.tileId == territoryId);
    if (!(playerId in tile!.clans)) tile!.clans[playerId] = 0;
    tile!.clans[playerId]++;
    game.players[playerId].reserveClans--;

    //check if all players are done placing initial clans
    if (
      Object.entries(game.players).every(
        ([_, player]) => player.reserveClans == 10
      )
    ) {
      game.placeInitialClans = false;
      //start assembly phase
      this.startAssemblyPhase(gameId);
    } else {
      //rotate turn to next player
      const playerKeys = Object.keys(game.players);
      game.placeClanTurn =
        playerKeys[(playerKeys.indexOf(playerId) + 1) % playerKeys.length];
    }

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static startAssemblyPhase(gameId: string) {
    const game = this.currentGames[gameId];

    //1. assign bren
    let playerWithMostClansInCapital = game.bren;
    const capitalTerritory = game.tiles.find(
      (tile) => tile.tileId == game.capitalTerritory
    );
    Object.entries(capitalTerritory!.clans).forEach(([playerId, numClans]) => {
      if (
        numClans > (capitalTerritory!.clans[playerWithMostClansInCapital] ?? 0)
      )
        playerWithMostClansInCapital = playerId;
    });
    game.bren = playerWithMostClansInCapital;

    //2. check for victory
    //TODO: implement this
    const winner = this.checkForVictory(gameId);
    if (winner != "") {
      //end game
      game.winner = winner;
      return;
    }

    //3. Take advantage cards 
    //remove old advantage cards
    Object.values(game.players).forEach(player => player.hand = player.hand.filter(cardId => !(cardId in advantageCards)));
    //get new advantage cards
    game.discardedAdvantageCards = [];
    game.tiles.forEach((tile) => {
      const chieftanOfTile = this.getChiefton(tile);
      if (chieftanOfTile != "") {
        game.players[chieftanOfTile].hand.push(
          allTiles[tile.tileId].advantageCard
        );
      }
    });
    //4. Flip the flock of crows
    game.flockOfCrowsIsClockwise = Math.random() < 0.5;

    //5. Deal action cards
    //remove old action cards
    Object.values(game.players).forEach(player => player.hand = player.hand.filter(cardId => !(cardId in actionCards)));
    game.discardedActionCards = [];
    game.dealActionCards();

    //6. Action card draft
    game.isDrafting = true;

    //other stuff
    //remove festival from all tiles
    game.tiles.forEach((tile) => tile.festival = false);
  }

  public static playCard(
    gameId: string,
    playerId: string,
    cardId: string
  ): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    const player = game.players[playerId];

    game.passCount = 0;

    //remove card from player hand and add to discarded pile
    player.hand = player.hand.filter((card) => card != cardId);

    //play card
    game.currentlyPlayingCard = cardId; //this tells the game that the card is being played. Next response received will include card manuever
    
    //if no manuever just play the card
    switch(game.currentlyPlayingCard){
      case "1": 
        return this.playBardSeasonActionCard(gameId, playerId);
    }

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  private static playedCardManuever(gameId: string, playerId: string, cardId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];

    //remove card manuever
    game.currentlyPlayingCard = "";

    //add card to discard pile
    if(cardId in actionCards) {
      game.discardedActionCards.push(cardId);
    }
    else if (cardId in advantageCards) {
      game.discardedAdvantageCards.push(cardId);
    }
    else if (cardId in epicTaleCards) {
      game.discardedEpicTaleCards.push(cardId);
    }

    //next person's turn TODO: use flock of crows in this
    const playerKeys = Object.keys(game.players);
    game.seasonPhasePlayerTurn =
      playerKeys[(playerKeys.indexOf(playerId) + 1) % playerKeys.length];

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static playSanctuaryActionCard(gameId: string, territoryId: string, playerId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //add sanctuary to that territory
    game.tiles.find((tile) => tile.tileId == territoryId)!.sanctuaries++;

    //add epic tale card to player's hand
    game.players[playerId].hand.push(game.epicTaleCards.pop()!);

    //return to all players in game
    return this.playedCardManuever(gameId, playerId, "12");
  }

  private static playBardSeasonActionCard(gameId: string, playerId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //add epic tale card to player's hand
    game.players[playerId].hand.push(game.epicTaleCards.pop()!);

    return this.playedCardManuever(gameId, playerId, "1");
  }

  public static playCitadelActionCard(gameId: string, territoryId: string, playerId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //add citadel to that territory
    game.tiles.find((tile) => tile.tileId == territoryId)!.citadels++;
    //add that advantage card to player's hand if it hasn't been played
    Object.values(game.players).forEach(player => player.hand = player.hand.filter(cardId => cardId != allTiles[territoryId].advantageCard));
    if(!game.discardedAdvantageCards.find(cardId => cardId == allTiles[territoryId].advantageCard)){
      game.players[playerId].hand.push(allTiles[territoryId].advantageCard);
    }

    return this.playedCardManuever(gameId, playerId, "2");
  }

  public static playMoveClansCard(gameId: string, moveClans: {from: string, to: string, numClans: number}[], playerId: string, cardId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //move clans
    moveClans.forEach(move => {
      const fromTile = game.tiles.find(tile => tile.tileId == move.from);
      const toTile = game.tiles.find(tile => tile.tileId == move.to);

      //add zero clans if player doesn't exist in the clan object
      if(!(playerId in fromTile!.clans)) fromTile!.clans[playerId] = 0;
      if(!(playerId in toTile!.clans)) toTile!.clans[playerId] = 0;

      fromTile!.clans[playerId] -= move.numClans;
      toTile!.clans[playerId] += move.numClans;

      //TODO INITIATE CLASHES
    });

    return this.playedCardManuever(gameId, playerId, cardId);
  }

  public static playAddClansCard(gameId: string, action: {territory: string, numClans: number}[], playerId: string, cardId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //add clans to territory
    action.forEach(action => {
      const tile = game.tiles.find(tile => tile.tileId == action.territory);
      if(!(playerId in tile!.clans)) tile!.clans[playerId] = 0;
      tile!.clans[playerId] += action.numClans;
    });

    return this.playedCardManuever(gameId, playerId, cardId);
  }

  public static playDruidCard(gameId: string, discardedCardId: string, playerId: string, cardId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //add card to player's hand
    game.players[playerId].hand.push(discardedCardId);
    //remove card from discarded pile
    game.discardedActionCards = game.discardedActionCards.filter(cardId => cardId != discardedCardId);
    return this.playedCardManuever(gameId, playerId, cardId);
  }

  public static playExplorationCard(gameId: string, tiles: NewTile, cardId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    game.players[game.seasonPhasePlayerTurn].reserveClans--;
    const gameTile : GameTile = {
      tileId: game.tileDeck.pop()!.id,
      positions: Object.values(tiles),
      clans: {},
      sanctuaries: 0,
      citadels: 0,
      festival: false
    };
    gameTile.clans[game.seasonPhasePlayerTurn] = 1; //add initial clan to this territory
    game.tiles.push(gameTile);

    return this.playedCardManuever(gameId, game.seasonPhasePlayerTurn, cardId);
  }

  public static playFestivalCard(gameId: string, tileId: string, playerId: string, cardId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //add clan to that territory
    const tile = game.tiles.find((tile) => tile.tileId == tileId)
    tile!.clans[playerId] = (tile!.clans[playerId] ?? 0) + 1;
    //add festival to that territory
    game.tiles.find((tile) => tile.tileId == tileId)!.festival = true;

    return this.playedCardManuever(gameId, playerId, cardId);
  }

  public static playNewAllianceCard(gameId: string, newAlliance: {territory: string, opponent: string}, playerId: string, cardId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    //add clan to that territory and remove from one opponent if opponent is specifies
    const tile = game.tiles.find((tile) => tile.tileId == newAlliance.territory);
    tile!.clans[playerId] = (tile!.clans[playerId] ?? 0) + 1;
    if(newAlliance.opponent != ""){
      tile!.clans[newAlliance.opponent] -= 1;
    }
    
    return this.playedCardManuever(gameId, playerId, cardId);
  }

  public static pass(gameId: string, playerId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    game.passCount++;

    //next person's turn TODO: use flock of crows in this
    const playerKeys = Object.keys(game.players);
    game.seasonPhasePlayerTurn =
      playerKeys[(playerKeys.indexOf(playerId) + 1) % playerKeys.length];

    //check if all players have passed, then end season phase and start assembly phase
    if (game.passCount == Object.keys(game.players).length) {
      game.isSeasonPhase = false;
      this.startAssemblyPhase(gameId);
    }

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static takePretenderToken(gameId: string, playerId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    const player = game.players[playerId];

    player.hasPretenderToken = true;
    game.passCount = 0;

    //next person's turn TODO: use flock of crows in this
    const playerKeys = Object.keys(game.players);
    game.seasonPhasePlayerTurn =
      playerKeys[(playerKeys.indexOf(playerId) + 1) % playerKeys.length];

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  private static getChiefton(tile: GameTile): string {
    let playerWithMostClans = Object.keys(tile.clans)[0];
    let tiesForMostClans = 0;
    Object.entries(tile.clans).forEach(([playerId, numClans]) => {
      if (numClans > (tile.clans[playerWithMostClans] ?? 0)) {
        playerWithMostClans = playerId;
        tiesForMostClans = 1;
      } else if (numClans == (tile.clans[playerWithMostClans] ?? 0)) {
        tiesForMostClans++;
      }
    });

    if (tiesForMostClans == 1 && tile.clans[playerWithMostClans]! > 0) {
      return playerWithMostClans;
    }
    return "";
  }

  //Returns playerId of winner if there is a winner, otherwise returns ""
  private static checkForVictory(gameId: string) : string{
    const game = this.currentGames[gameId];
    const potentialWinners = Object.values(game.players).filter(player => player.hasPretenderToken).map(player  => {return{playerId: player.id, winConditions : 0}});
    //remove old pretender tokens
    Object.values(game.players).forEach(player => player.hasPretenderToken = false);

    //check victory conditions per player
    potentialWinners.forEach(potentialWinner => {
      //get how many victory conditions player meets
    
      //condition 1 : chieftan over 6 or more opposing clans
      let chieftanOverXOpposingClans = 0;
      game.tiles.forEach(tile => {
        if(this.getChiefton(tile) == potentialWinner.playerId){
          Object.entries(tile.clans).forEach(([playerId, numClans]) => {
            if(playerId != potentialWinner.playerId){
              chieftanOverXOpposingClans += numClans;
            }
          });
        }
      });
      if(chieftanOverXOpposingClans >= 6){
        potentialWinner.winConditions++;
      }
      //condition 2 : present in territories with 6 or more total sanctuaries
      let totalSanctuariesPresentIn = 0;
      game.tiles.forEach(tile => {
        if(potentialWinner.playerId in tile.clans && tile.clans[potentialWinner.playerId] > 0){
          totalSanctuariesPresentIn += tile.sanctuaries;
        }
      });
      if(totalSanctuariesPresentIn >= 6){
        potentialWinner.winConditions++;
      }
      //condition 3 : present in 6 or more territories
      let totalTerritoriesPresentIn = 0;
      game.tiles.forEach(tile => {
        if(potentialWinner.playerId in tile.clans && tile.clans[potentialWinner.playerId] > 0){
          totalTerritoriesPresentIn++;
        }
      });
      if(totalTerritoriesPresentIn >= 6){
        potentialWinner.winConditions++;
      }
    });

    let winners : string[] = [];
    let currentMaxWinConditions = 1;
    potentialWinners.forEach(potentialWinner => {
      if(potentialWinner.winConditions > currentMaxWinConditions){
        winners = [potentialWinner.playerId];
        currentMaxWinConditions = potentialWinner.winConditions
      } else if(potentialWinner.winConditions == currentMaxWinConditions){
        winners.push(potentialWinner.playerId);
      }
    });

    //return winner
    if(winners.length == 1){
      return winners[0];
    } else {
      winners.forEach(winner => {
        if(winner == game.bren){
          return winner;
        }
      })
    }
    return "";
  }
}
