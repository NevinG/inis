import { type GameState, GamePrivacy } from "$lib/types/GameState";

export function load({params}) : GameState {
  //get game state from server and return it to frontend
  //for now return a sample game
  return {
    id: params.code,
    privacy: GamePrivacy.Public,
    hasStarted: false,
    players: {
      "player1": {id: "player1", name: "Player 1"},
      "player2": {id: "player2", name: "Player 2"},
      "player3": {id: "player3", name: "Player 3"},
    }
  };
}