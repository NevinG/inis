import { actionCards, advantageCards, epicTaleCards } from "../types/Card";
import {
  GamePreview,
  GamePrivacy,
  GameState,
  RestrictedGameState,
} from "../types/GameState";
import { Player } from "../types/Player";
import { allTiles, GameTile } from "../types/Tile";
import { ClashAttackResponse, NewTile, SocketManager } from "./SocketManager";

export default class GameManager {
  static lastGameStates: { [gameId: string]: GameState } = {};
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
        game.geisAvailable = false;

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
      }, (process.env.DEV_MODE == "true" ? 0 : 10) * 1000);
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

    //remove available triskals from all players
    Object.values(game.players).forEach(player => player.triskalsAvailable = []);

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

  private static saveGameState(gameId: string) {
    this.lastGameStates[gameId] = this.currentGames[gameId].clone();
  }

  private static restoreGameState(gameId: string) {
    this.currentGames[gameId] = this.lastGameStates[gameId];
  }

  private static playGeis(gameId: string, playerId: string) {
    let cardToDiscard = null;
    if(this.currentGames[gameId].currentlyPlayingCard){
      cardToDiscard = this.currentGames[gameId].currentlyPlayingCard;
    } else {
      cardToDiscard = this.currentGames[gameId].discardedActionCards.pop();
    }
    this.restoreGameState(gameId);
    const game = this.currentGames[gameId];

    //remove geis card from hand
    this.currentGames[gameId].players[playerId].hand = this.currentGames[gameId].players[playerId].hand.filter(cardId => cardId != "8");

    //move turn order
    //TODO: use abstraction here and flock of crows
    const playerKeys = Object.keys(this.currentGames[gameId].players);
    this.currentGames[gameId].seasonPhasePlayerTurn =
      playerKeys[(playerKeys.indexOf(game.seasonPhasePlayerTurn) + 1) % playerKeys.length];

    if(cardToDiscard) {
      //remove cardToDiscard from all players hands
      Object.values(game.players).forEach(player => player.hand = player.hand.filter(cardId => cardId != cardToDiscard));

      this.discardCard(gameId, cardToDiscard);
    }
    
    //remove available triskals from all players
    Object.values(game.players).forEach(player => player.triskalsAvailable = []);
    
    game.currentlyPlayingCard = "";
  }

  public static playCard(
    gameId: string,
    playerId: string,
    cardId: string
  ): [string, RestrictedGameState][] {
    this.saveGameState(gameId);

    const game = this.currentGames[gameId];
    const player = game.players[playerId];

    game.passCount = 0;

    //reset each players triskals after someone plays a card
    Object.values(game.players).forEach(player => player.triskalsAvailable = []);

    //remove card from player hand and add to discarded pile
    player.hand = player.hand.filter((card) => card != cardId);

    //play card
    game.currentlyPlayingCard = cardId; //this tells the game that the card is being played. Next response received will include card manuever

    //if action card mark that geiss is available
    if(cardId in actionCards){
      this.makeGeisAvailable(gameId);
    }
    
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

  public static playTriskalCard(
    gameId: string,
    playerId: string,
    cardId: string
  ): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    const player = game.players[playerId];

    //remove card from player hand and add to discarded pile
    player.hand = player.hand.filter((card) => card != cardId);
    
    //if no manuever just play the card
    switch(cardId){
      case "1": 
        this.playBardTriskal(gameId, playerId);
        break;
      case "8":
        this.playGeis(gameId, playerId);
        break;
      case "13":
        this.playWarlordTriskal(gameId, playerId);
        break;
    }

    return this.playedCardManuever(gameId, playerId, cardId, true);
  }

  private static discardCard(gameId: string, cardId: string) {
    const game = this.currentGames[gameId];

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
  }

  private static resolveClash(gameId: string) {
    const game = this.currentGames[gameId];

    // Remove the resolved territory from the list
    game.clashes.territories = game.clashes.territories.filter(
      (territory) => territory !== game.clashes.currentlyResolvingTerritory
    );

    //remove any warlord triskals available
    Object.values(game.players).forEach(player => player.triskalsAvailable = player.triskalsAvailable.filter(x => x != "13"));

    //take clans out of citadels
    Object.entries(game.clashes.citadel).forEach(([playerId, numClans]) => {
      game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)!.clans[playerId] += numClans;
    });

    game.clashes.currentlyResolvingTerritory = "";

    // Check if there are more clashes to resolve
    if (game.clashes.territories.length ==  0) {
      // Reset all clash variables
      game.clashes = {
        instigatorId: "",
        territories: [],
        currentlyResolvingTerritory: "",
        playerTurn: "",
        citadel: {},
        citadelPlayerTurn: "",
        citadelStageOver: false,
        donePlayingCitadels: [],
        attackedPlayer: "",
        votesToResolve: {},
      };
    }
  }

  public static playNotImplemented(gameId: string, playerId: string, cardId: string): [string, RestrictedGameState][] {
    return this.playedCardManuever(gameId, playerId, cardId)
  }

  private static playedCardManuever(gameId: string, playerId: string, cardId: string, triskal: boolean = false): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];

    //if there is a clash return the current game state and the clash is going to be resolved
    if(game.clashes.instigatorId != "" && !triskal) {
      //if there is only one clash, set that as the currently resolving territory
      //otherwise the frontend is going to have to choose which territory to resolve
      if (game.clashes.territories.length == 1) {
        game.clashes.currentlyResolvingTerritory = game.clashes.territories[0];
      }

      //make the instigator the first player to resolve the clash
      game.clashes.playerTurn = game.clashes.instigatorId;
    }

    //if this card is an action card make geis available true, and set a timeout for 10 seconds to disable it and return state to all players
    if(cardId in actionCards){
      this.makeGeisAvailable(gameId);
      setTimeout(() => {
        const game = this.currentGames[gameId];
        game.geisAvailable = false;
        Object.keys(game.players).forEach((playerId) => {
          SocketManager.currentSockets[game.players[playerId].socketId].send(
            JSON.stringify(game.getGameInstance(playerId))
          );
        });
      }, 10 * 1000);
    }

    //remove card manuever
    if(!triskal)
      game.currentlyPlayingCard = "";

    this.discardCard(gameId, cardId);

    //next person's turn TODO: use flock of crows in this
    if(!triskal) {
      const playerKeys = Object.keys(game.players);
      game.seasonPhasePlayerTurn =
        playerKeys[(playerKeys.indexOf(playerId) + 1) % playerKeys.length];
    }

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  private static makeGeisAvailable (gameId: string) {
    const game = this.currentGames[gameId];
    game.geisAvailable = true;
    //if a player has the geiss in thier hand let them know that triskal is available
    Object.values(game.players).forEach(player => {
      if(player.hand.includes("8") && game.seasonPhasePlayerTurn != player.id && !player.triskalsAvailable.includes("8")) //cant play geiss on yourself
        player.triskalsAvailable.push("8");
    });
  }

  public static chooseClashingTerritory(gameId: string, territoryId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    game.clashes.currentlyResolvingTerritory = territoryId;

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static clashMoveToCitadel(gameId: string, playerId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    const tile = game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory);

    //move clan to citadel
    game.clashes.citadel[playerId] = (game.clashes.citadel[playerId] ?? 0) + 1;
    tile!.clans[playerId]--;

    //check if citadel stage is resolved
    game.clashes.citadelStageOver = this.checkIfCitadelStageResolved(gameId);

    //next players turn to place citadel
    //follow turn order of players ignoring the instigator
    //TODO: flock of crows
    if(!game.clashes.citadelStageOver) {
      const playerKeys = Object.keys(game.players).filter(key => (game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)?.clans[key] ?? 0 > 0) && (key != game.clashes.instigatorId) && !game.clashes.donePlayingCitadels.includes(key));
      game.clashes.citadelPlayerTurn = playerKeys[(playerKeys.indexOf(game.clashes.citadelPlayerTurn) + 1) % playerKeys.length];
    } else {
      this.checkClashResolved(gameId);
    }

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static donePlacingInCitadels(gameId: string, playerId: string): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];

    game.clashes.donePlayingCitadels.push(playerId);

    //check if citadel stage is resolved
    game.clashes.citadelStageOver = this.checkIfCitadelStageResolved(gameId);
    game.clashes.citadelPlayerTurn = "";

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  private static checkIfCitadelStageResolved(gameId: string): boolean {
    const game = this.currentGames[gameId];
    const tile = game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory);

    const numPlayersWithExposedClans = Object.values(tile!.clans).filter(clan => clan > 0).length;
    return numPlayersWithExposedClans - game.clashes.donePlayingCitadels.length == 1 || Object.values(game.clashes.citadel).reduce((a, b) => a + b, 0) == game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)!.citadels;
  }

  private static checkClashResolved(gameId: string){
    const game = this.currentGames[gameId];
    //ignore if clash is already resolved
    if(game.clashes.instigatorId == "" || game.clashes.currentlyResolvingTerritory == "") return;

    //if there is only one player with exposed territories left then resolve the clash

    const tile = game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory);
    const numPlayersWithExposedClans = Object.values(tile!.clans).filter(clan => clan > 0).length;

    if(numPlayersWithExposedClans == 1 || numPlayersWithExposedClans == Object.values(game.clashes.votesToResolve).filter(vote => vote).length){
      this.resolveClash(gameId);
    }
  }

  private static addWarlordTriskal(gameId: string) {
    const game = this.currentGames[gameId];
    Object.values(game.players).forEach(player => {
      if(player.hand.includes("13") && !player.triskalsAvailable.includes("13"))
        player.triskalsAvailable.push("13")
    })
  }

  public static clashAttack(gameId: string, attackedPlayerId: string) : [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    game.clashes.attackedPlayer = attackedPlayerId;

    //check if player has no actions cards to discard
    if(game.players[attackedPlayerId].hand.filter(cardId => cardId in actionCards).length == 0){
      //player must remove a clan from the territory
      game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)!.clans[attackedPlayerId]--;
      game.clashes.attackedPlayer = "";

      //make warlord triskal available
      this.addWarlordTriskal(gameId);

      //next players turn in clash
      //next person's turn TODO: use flock of crows in this
      const playerKeys = Object.keys(game.players).filter(key => game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)?.clans[key] ?? 0 > 0);
      game.clashes.playerTurn =
        playerKeys[(playerKeys.indexOf(game.clashes.playerTurn) + 1) % playerKeys.length];
    }

    //clear clash resolve votes
    game.clashes.votesToResolve = {};

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static clashAttackResponse(gameId: string, playerId: string, clashAttackResponse: ClashAttackResponse) : [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    if(clashAttackResponse.removeClan) {
      game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)!.clans[playerId]--;
      //bard triskal activated
      if(game.players[game.clashes.playerTurn].hand.includes("1"))
        game.players[game.clashes.playerTurn].triskalsAvailable.push("1");
    }

    if(clashAttackResponse.removedCard) {
      game.players[playerId].hand = game.players[playerId].hand.filter(cardId => cardId != clashAttackResponse.removedCard);
      game.discardedActionCards.push(clashAttackResponse.removedCard);
    }

    //make warlord triskal available
    this.addWarlordTriskal(gameId);

    //player is no longer being attacked
    game.clashes.attackedPlayer = "";

    //next players turn in clash
    //next person's turn TODO: use flock of crows in this
    const playerKeys = Object.keys(game.players).filter(key => game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)?.clans[key] ?? 0 > 0);
    game.clashes.playerTurn = playerKeys[(playerKeys.indexOf(game.clashes.playerTurn) + 1) % playerKeys.length];
    
    //if there is only one player with exposed territories left then resolve the clash
    this.checkClashResolved(gameId);

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }

  public static clashVoteToResolve(gameId: string, playerId: string, vote: boolean) : [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    game.clashes.votesToResolve[playerId] = vote;

    //if all players with exposed clans in the territory have voted to resolve then the clash is over
    this.checkClashResolved(gameId);

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

  private static playBardTriskal(gameId: string, playerId: string){
    //give player a deed
    const game = this.currentGames[gameId];
    game.players[playerId].deedCount++;

    //remove triskal option
    game.players[playerId].triskalsAvailable = game.players[playerId].triskalsAvailable.filter(triskal => triskal != "1");
  }

  private static playWarlordTriskal(gameId: string, playerId: string) {
    //give player an exposed clan
    const game = this.currentGames[gameId];
    const clashingTerritory = game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory);

    clashingTerritory!.clans[playerId] += 1;
    game.currentlyPlayingTriskalCard = "13";
    game.playerTurnForResolvingTriskal = playerId;
  }

  public static playWarlordTriskalActionCard(gameId: string, playerId: string, chosenPlayerId: string) {
    const game = this.currentGames[gameId];
    game.clashes.playerTurn = chosenPlayerId

    game.players[playerId].triskalsAvailable = game.players[playerId].triskalsAvailable.filter(x => x != "13");
    game.currentlyPlayingTriskalCard = ""; 
    return this.playedCardManuever(gameId, playerId, "13", true);
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

  public static playMoveClansCard(gameId: string, moveClans: {from: string, to: string, numClans: number}[], playerId: string, cardId: string, clashWithdraw: boolean = false): [string, RestrictedGameState][] {
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
      if (!clashWithdraw && Object.values(toTile!.clans).filter(x => x > 0).length > 1 ){
        game.addClash(playerId, move.to);
        
        //check if clash already resolved, can happen because festival toke
        this.checkClashResolved(gameId);
      }
    });

    return this.playedCardManuever(gameId, playerId, cardId, cardId == "-1");
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
    if(discardedCardId) {
      const game = this.currentGames[gameId];
      //add card to player's hand
      game.players[playerId].hand.push(discardedCardId);
      //remove card from discarded pile
      game.discardedActionCards = game.discardedActionCards.filter(cardId => cardId != discardedCardId);
    }
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

    //TODO: maybe move this logic somewhere elsed
    //remove available triskals from all players
    Object.values(game.players).forEach(player => player.triskalsAvailable = []);

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

  public static playWarlordSeasonActionCard(gameId: string, playerId: string, territory: string, cardId: string) : [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];

    game.addClash(playerId, territory);
    
    //check if clash already resolved, can happen because festival toke
    this.checkClashResolved(gameId);

    //remove any warlord triskals available
    Object.values(game.players).forEach(player => player.triskalsAvailable = player.triskalsAvailable.filter(x => x != "13"));

    return this.playedCardManuever(gameId, playerId, cardId);
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
      if(chieftanOverXOpposingClans >= 6 - game.players[potentialWinner.playerId].deedCount){
        potentialWinner.winConditions++;
      }
      //condition 2 : present in territories with 6 or more total sanctuaries
      let totalSanctuariesPresentIn = 0;
      game.tiles.forEach(tile => {
        if(potentialWinner.playerId in tile.clans && tile.clans[potentialWinner.playerId] > 0){
          totalSanctuariesPresentIn += tile.sanctuaries;
        }
      });
      if(totalSanctuariesPresentIn >= 6 - game.players[potentialWinner.playerId].deedCount){
        potentialWinner.winConditions++;
      }
      //condition 3 : present in 6 or more territories
      let totalTerritoriesPresentIn = 0;
      game.tiles.forEach(tile => {
        if(potentialWinner.playerId in tile.clans && tile.clans[potentialWinner.playerId] > 0){
          totalTerritoriesPresentIn++;
        }
      });
      if(totalTerritoriesPresentIn >= 6 - game.players[potentialWinner.playerId].deedCount){
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

  public static handleClashWithdraw(gameId: string, moveClans: {from: string, to: string, numClans: number}[]): [string, RestrictedGameState][] {
    const game = this.currentGames[gameId];
    this.playMoveClansCard(gameId, moveClans, game.clashes.playerTurn, "-1", true);

    //player is no longer being attacked
    game.clashes.attackedPlayer = "";

    //next players turn in clash
    //next person's turn TODO: use flock of crows in this
    const playerKeys = Object.keys(game.players).filter(key => game.tiles.find(tile => tile.tileId == game.clashes.currentlyResolvingTerritory)?.clans[key] ?? 0 > 0);
    game.clashes.playerTurn = playerKeys[(playerKeys.indexOf(game.clashes.playerTurn) + 1) % playerKeys.length];
    
    //if there is only one player with exposed territories left then resolve the clash
    this.checkClashResolved(gameId);

    //clear clash resolve votes
    game.clashes.votesToResolve = {};

    //return to all players in game
    return Object.keys(game.players).map((playerId) => [
      game.players[playerId].socketId,
      game.getGameInstance(playerId),
    ]);
  }
}
