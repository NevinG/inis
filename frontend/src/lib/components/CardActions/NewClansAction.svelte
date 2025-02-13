<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { GameUIState, RestrictedGameState } from '$lib/types/GameState';
	import type { GameTile } from '$lib/types/Tile';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;
	let addedClans: { territory: string; numClans: number }[] = [];

	export let socket: WebSocket;
	export let gameId: string;
	export let gameUIState: GameUIState;

	function addClan(tile: GameTile & { selected: boolean }) {
		const addedClan = addedClans.find((clan) => clan.territory == tile.tileId);
		if (addedClan) {
			addedClan.numClans++;
		} else {
			addedClans.push({ territory: tile.tileId, numClans: 1 });
		}
		addedClans = addedClans;
	}

	function removeClan(tile: GameTile & { selected: boolean }) {
		const addedClan = addedClans.find((clan) => clan.territory == tile.tileId);
		addedClan!.numClans--;
		addedClans = addedClans;
	}
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} selectTile={async () => {}} {addedClans} let:tile>
		{#if restrictedGameState.playerId in tile.clans && tile.clans[restrictedGameState.playerId] > 0}
			<div>
				{#if (addedClans.reduce((total, addClan) => total + addClan.numClans, 0) ?? 0) < 2}
					<button
						on:click={() => {
							addClan(tile);
						}}>+</button
					>
				{/if}
				{#if addedClans.find((addClan) => addClan.territory == tile.tileId)?.numClans ?? 0}
					<button
						on:click={() => {
							removeClan(tile);
						}}>-</button
					>
				{/if}
			</div>
		{/if}
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
	<span>Use the buttons on territories to add clans</span>&nbsp;
	<button
		on:click={async () => {
			socket.send(JSON.stringify(await GameActionFactory.newClansActionCard(gameId, addedClans)));
		}}
		style:height="25px">Submit</button
	>
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar bind:gameUIState={gameUIState} {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
