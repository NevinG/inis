<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import type { GameTile } from '$lib/types/Tile';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;
	$: gameTiles = restrictedGameState.tiles as (GameTile & { selected: boolean })[];
	$: selectedTile = gameTiles.filter((tile) => tile.selected)[0];
	let chosenOpponent = '';
	$: addedClans = [
		{ territory: selectedTile?.tileId, numClans: 1 },
		{ territory: selectedTile?.tileId, numClans: -1, playerId: chosenOpponent }
	];

	export let socket: WebSocket;
	export let gameId: string;

	export async function selectTile(tileId: string) {
		const tile = gameTiles.find((tile) => tile.tileId == tileId);

		if (tile!.selected) {
			tile!.selected = false;
		} else {
			//unselect all tiles
			gameTiles.forEach((tile) => (tile.selected = false));
			if (tile?.clans[restrictedGameState.playerId] ?? 0 > 0) tile!.selected = true;
		}
		restrictedGameState = restrictedGameState;
		chosenOpponent = '';
	}
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} {selectTile} {addedClans} />
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
	<span>Choose a territory to put/replace a new clan</span>&nbsp;
	{#if selectedTile}
		{#each Object.keys(selectedTile.clans) as playerWithClanId}
			{#if selectedTile.clans[playerWithClanId] > 1 && playerWithClanId != restrictedGameState.playerId}
				<button
					style:height="25px"
					style:margin-right="4px"
					style:font-weight={chosenOpponent == playerWithClanId ? 'bold' : undefined}
					on:click={() => {
						chosenOpponent = chosenOpponent == playerWithClanId ? '' : playerWithClanId;
					}}>{restrictedGameState.players[playerWithClanId].name}</button
				>
			{/if}
		{/each}
	{/if}
	<button
		disabled={!selectedTile}
		on:click={async () => {
			socket.send(
				JSON.stringify(
					await GameActionFactory.newAllianceActionCard(gameId, selectedTile.tileId, chosenOpponent)
				)
			);
		}}
		style:height="25px"
		>Submit ({chosenOpponent
			? `replace ${restrictedGameState.players[chosenOpponent].name}'s clan'`
			: 'replace no clan'})</button
	>
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
