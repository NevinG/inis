import type { GamePreview } from "$lib/types/GameState";
import { api } from "$lib/util/api";

export async function load() : Promise<{games: GamePreview[]}> {
  return await api.getPublicGames();
}