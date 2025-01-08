import { Player } from "../types/Player";
import GameManager from "./GameManager";
import jwt, { JwtPayload } from "jsonwebtoken";

type GameAction = {
  type: GameActionType;
  gameId: string;
  playerJWT: string;
  data: 
  JoinGame | 
  DraftCards | 
  ChooseTerritory |
  PlayCard |
  MoveClans |
  AddClans |
  NewTile |
  NewAlliance |
  ChoosePlayer |
  ClashAttackResponse |
  YesOrNO;
};

type JoinGame = {
  name: string;
};

type ChooseTerritory = {
  territory: string;
};

type DraftCards = {
  cardsToKeep: string[]; //ids of cards you are keeping
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

type NewAlliance= {
  territory: string;
  opponent: string;
}

type ChoosePlayer = {
  playerId: string
}

type YesOrNO = {
  yes: boolean
}

export type ClashAttackResponse = {
  removeClan: boolean;
  removedCard: string;
}

export type NewTile = {
  0: {x: number, y: number},
  1: {x: number, y: number},
  2: {x: number, y: number},
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
  PlayTriskalCard,
	Pass,
	TakePretenderToken,
  ChooseClashingTerritory,
  ClashMoveToCitadel,
  ClashDonePlacingInCitadels,
  ClashAttack,
  ClashAttackResponse,
  ClashVoteToResolve,
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
  NewClansActionCard,
  NotImplementedAction,
}

export class SocketManager {
  static currentSockets: { [id: string]: WebSocket } = {};

  public static AddSocket(ws: WebSocket & { id: string }) {
    this.currentSockets[ws.id] = ws;
  }

  public static HandleMessage(socketId: string, message: string): void {
    const gameAction = JSON.parse(message) as GameAction;
    //jwt verification
    let playerId: string = "";
    try {
      const jwtData = jwt.verify(
        gameAction.playerJWT,
        process.env.TOKEN_SECRET as string
      ) as JwtPayload;
      playerId = jwtData.id;
    } catch (e) {
      //remove connection
      this.currentSockets[socketId].close();
    }

    //make sure valid game id
    if (!GameManager.gameExists(gameAction.gameId)) {
      return null!;
    }

    switch (gameAction.type) {
      case GameActionType.ViewGame:
        this.currentSockets[socketId].send(
          JSON.stringify(GameManager.getGame(playerId, gameAction.gameId))
        );
        break;

      case GameActionType.JoinGame:
        const joinGame = gameAction.data as JoinGame;
        GameManager.joinGame(
          new Player(playerId, socketId, joinGame.name),
          gameAction.gameId
        ).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;

      case GameActionType.ReadyUp:
        GameManager.readyUp(playerId, gameAction.gameId).forEach(
          ([socketId, gameState]) => {
            this.currentSockets[socketId].send(JSON.stringify(gameState));
          }
        );
        break;

      case GameActionType.UnreadyUp:
        GameManager.unreadyUp(playerId, gameAction.gameId).forEach(
          ([socketId, gameState]) => {
            this.currentSockets[socketId].send(JSON.stringify(gameState));
          }
        );
        break;

      case GameActionType.DraftCards:
        const draftCards = gameAction.data as DraftCards;
        GameManager.draftCards(
          playerId,
          gameAction.gameId,
          draftCards.cardsToKeep
        ).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;

      case GameActionType.ChooseCapitalTerritory:
        const chooseCapitalTerritory =
          gameAction.data as ChooseTerritory;
        GameManager.chooseCapitalTerritory(
          gameAction.gameId,
          chooseCapitalTerritory.territory
        ).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;

      case GameActionType.PlaceInitialClan:
        const placeClanTurn =
          gameAction.data as ChooseTerritory;
        GameManager.placeInitialClan(
          gameAction.gameId,
          placeClanTurn.territory,
          playerId
        ).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      
      case GameActionType.PlayCard:
        const playCardTurn = gameAction.data as PlayCard;
        GameManager.playCard(gameAction.gameId, playerId, playCardTurn.cardId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;

      case GameActionType.PlayTriskalCard:
        const triskalCard = gameAction.data as PlayCard;
        GameManager.playTriskalCard(gameAction.gameId, playerId, triskalCard.cardId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;

      case GameActionType.Pass:
        GameManager.pass(gameAction.gameId, playerId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;

      case GameActionType.TakePretenderToken:
        GameManager.takePretenderToken(gameAction.gameId, playerId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ChooseClashingTerritory:
        const chooseClashingTerritory = gameAction.data as ChooseTerritory;
        GameManager.chooseClashingTerritory(gameAction.gameId, chooseClashingTerritory.territory).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ClashMoveToCitadel:
        GameManager.clashMoveToCitadel(gameAction.gameId, playerId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ClashDonePlacingInCitadels:
        GameManager.donePlacingInCitadels(gameAction.gameId, playerId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ClashAttack:
        const clashAttack = gameAction.data as ChoosePlayer;
        GameManager.clashAttack(gameAction.gameId, clashAttack.playerId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ClashAttackResponse:
        const clashAttackResponse = gameAction.data as ClashAttackResponse;
        GameManager.clashAttackResponse(gameAction.gameId, playerId, clashAttackResponse).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ClashVoteToResolve:
        const vote = gameAction.data as YesOrNO;
        GameManager.clashVoteToResolve(gameAction.gameId, playerId, vote.yes).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.SanctuaryActionCard:
        const sanctuaryActionCard = gameAction.data as ChooseTerritory;
        GameManager.playSanctuaryActionCard(gameAction.gameId, sanctuaryActionCard.territory, playerId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.CitadelActionCard:
        const citadelActionCard = gameAction.data as ChooseTerritory;
        GameManager.playCitadelActionCard(gameAction.gameId, citadelActionCard.territory, playerId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ConquestActionCard:
        const conquestActionCardClansMoved = gameAction.data as MoveClans;
        GameManager.playMoveClansCard(gameAction.gameId, conquestActionCardClansMoved, playerId, "3").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.CraftsmanAndPeasantsActionCard:
        const action = gameAction.data as AddClans;
        GameManager.playAddClansCard(gameAction.gameId, action, playerId, "4").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.DruidActionCard:
        const druidAction = gameAction.data as PlayCard;
        GameManager.playDruidCard(gameAction.gameId, druidAction.cardId, playerId, "5").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ExplorationActionCard:
        const explorationAction = gameAction.data as NewTile;
        GameManager.playExplorationCard(gameAction.gameId, explorationAction, "6").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.FestivalActionCard:
        const festivalAction = gameAction.data as ChooseTerritory;
        GameManager.playFestivalCard(gameAction.gameId, festivalAction.territory, playerId, "7").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.MigrationActionCard:
        const migrationActionCard = gameAction.data as MoveClans;
        GameManager.playMoveClansCard(gameAction.gameId, migrationActionCard, playerId, "9").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.ClashWithdraw:
        const clanWithdrawMoves = gameAction.data as MoveClans;
        GameManager.handleClashWithdraw(gameAction.gameId, clanWithdrawMoves).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.NewAllianceActionCard:
        const newAllianceCard = gameAction.data as NewAlliance;
        GameManager.playNewAllianceCard(gameAction.gameId, newAllianceCard, playerId, "10").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.NewClansActionCard:
        const newClansCard = gameAction.data as AddClans;
        GameManager.playAddClansCard(gameAction.gameId, newClansCard, playerId, "11").forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
      case GameActionType.NotImplementedAction:
        const NotImplementedAction = gameAction.data as PlayCard;
        GameManager.playNotImplemented(gameAction.gameId, playerId, NotImplementedAction.cardId).forEach(([socketId, gameState]) => {
          this.currentSockets[socketId].send(JSON.stringify(gameState));
        });
        break;
    }
    return null!;
  }
}
