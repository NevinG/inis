import { allTiles, type Tile } from '$lib/types/Tile';

export function load(): { tiles: Tile[] } {
	return { tiles: Object.entries(allTiles).map(([_, tile]) => tile) };
}
