<script lang="ts">
	import type { RestrictedGameState } from '$lib/types/GameState';
	import GameBottomBar from './GameBottomBar.svelte';
	import GameMap from './GameMap.svelte';
	import GameTopBar from './GameTopBar.svelte';
	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	export let gameId: string;
</script>

{#if restrictedGameState.winner == ''}
	<div style:width="100%" style:height="15%" style:display="flex">
		<GameTopBar {restrictedGameState} />
	</div>
	<div style:width="100%" style:height="65%">
		<GameMap {restrictedGameState} {socket} {gameId} />
	</div>
	<div style:width="100%" style:height="20%" style:display="flex">
		<GameBottomBar {restrictedGameState} {socket} {gameId} />
	</div>
{:else}
	<p>Game Over! The winner is {restrictedGameState.players[restrictedGameState.winner].name}</p>
{/if}
