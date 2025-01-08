<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;

	export let socket: WebSocket;
	export let gameId: string;

	let newTileParts: { x: number; y: number }[] = [];
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} displayPossibleNewTiles={true} bind:newTileParts />
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
	<span>Choose where the new tile is going to be placed</span>&nbsp;
	{#if newTileParts.length > 0}
		<button
			style:height="25px"
			style:margin-right="5px"
			on:click={() => {
				newTileParts.pop();
				newTileParts = newTileParts;
			}}>Back</button
		>
	{/if}
	<button
		on:click={async () => {
			socket.send(
				JSON.stringify(
					await GameActionFactory.explorationActionCard(gameId, {
						0: newTileParts[0],
						1: newTileParts[1],
						2: newTileParts[2]
					})
				)
			);
		}}
		style:height="25px">Submit</button
	>
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
