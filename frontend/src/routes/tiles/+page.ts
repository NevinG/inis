import { allTiles, type Tile } from '$lib/types/Tile';

export function load(): { tiles: Tile[] } {
	return {tiles: allTiles};
}
