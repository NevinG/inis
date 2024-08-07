<script lang="ts">
	import type { RestrictedGameState } from '$lib/types/GameState';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;

	export let socket: WebSocket;
	export let gameId: string;
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} />
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
	<span>The bren is placing the tile for you!</span>
</div>
<div style:width="100%" style:height="20%" style:display="flex">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
