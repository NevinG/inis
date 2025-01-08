<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import type { GameTile } from '$lib/types/Tile';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;
	$: gameTiles = restrictedGameState.tiles as (GameTile & { selected: boolean })[];
	$: selectedTile = gameTiles.filter((tile) => tile.selected)[0];

	export let socket: WebSocket;
	export let gameId: string;

	async function selectTile(tileId: string) {
		const tile = gameTiles.find((tile) => tile.tileId == tileId);

		if (tile!.selected) {
			tile!.selected = false;
		} else {
			//unselect all tiles
			gameTiles.forEach((tile) => (tile.selected = false));
			if (tile?.clans[restrictedGameState.playerId] ?? 0 > 0) tile!.selected = true;
		}
		restrictedGameState = restrictedGameState;
	}
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} {selectTile} />
</div>
<div
	style:width="-webkit-fill-available"
	style:position="absolute"
	style:padding-bottom="10px"
	style:bottom="20%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="center"
>
	<span>Choose territory to place citadel in.</span>&nbsp;
	<button
		disabled={!selectedTile}
		on:click={async () => {
			socket.send(
				JSON.stringify(await GameActionFactory.citadelActionCard(gameId, selectedTile.tileId))
			);
		}}
		style:height="25px">Submit</button
	>
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
