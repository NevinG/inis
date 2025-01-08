<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import type { GameTile } from '$lib/types/Tile';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;
	let addedClans: { territory: string; numClans: number }[] = [];

	export let socket: WebSocket;
	export let gameId: string;
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} selectTile={async () => {}} {addedClans} let:tile>
	</GameMap>
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
	<span>This card isn't implemented. You can still play it. It just doesn nothing</span>&nbsp;
	<button
		on:click={async () => {
			socket.send(JSON.stringify(await GameActionFactory.PlayNotImplementedActionCard(gameId, restrictedGameState.currentlyPlayingCard)));
		}}
		style:height="25px">Play Card</button
	>
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
