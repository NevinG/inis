import type { CreateGame } from "$lib/types/CreateGame";
import type { GameState } from "$lib/types/GameState";

export const api = {
  createGame: async (createGame: CreateGame) : Promise<GameState> => {
    const response = await fetch("http://localhost:3000/api/create", {
      method: "POST",
      body: JSON.stringify(createGame),
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  },
  getGame: async(id: string) : Promise<GameState> => {
    const response = await fetch(`http://localhost:3000/api/game/${id}`);
    return await response.json();
  }
}