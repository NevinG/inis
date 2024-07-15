import { type GameState, GamePrivacy } from "$lib/types/GameState";
import { api } from "$lib/util/api";

export async function load({params}) : Promise<GameState> {
  return await api.getGame(params.id);
}