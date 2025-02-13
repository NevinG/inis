<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { GameUIState, RestrictedGameState } from '$lib/types/GameState';
	import { type GameTile } from '$lib/types/Tile';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;
	$: gameTiles = restrictedGameState.tiles as (GameTile & { selected: boolean })[];

	export let socket: WebSocket;
	export let gameId: string;
	export let gameUIState: GameUIState;

	let actionStep = 0; //first step is to choose a territory. second step move clans from adjacent territories to that territory.
	let clanMoves: { from: string; to: string; numClans: number }[] = [];
	let targetTile = '';

	//apply clan moves to gameState

	function selectTile(tileId: string) {
		const tile = gameTiles.find((tile) => tile.tileId == tileId);

		if (actionStep == 0) {
			targetTile = tileId;
			actionStep = 1;
		}
		restrictedGameState = restrictedGameState;
	}

	function moveTroop(tile: GameTile & { selected: boolean }) {
		const move = clanMoves.find((move) => move.from == tile.tileId);
		if (move) {
			move.numClans++;
		} else {
			clanMoves.push({ from: tile.tileId, to: targetTile, numClans: 1 });
		}
		clanMoves = clanMoves;
	}

	function takeTroopBack(tile: GameTile & { selected: boolean }) {
		const move = clanMoves.find((move) => move.from == tile.tileId);
		if (move) {
			move.numClans--;
			if (move.numClans == 0) {
				clanMoves = clanMoves.filter((move) => move.from != tile.tileId);
			}
		}
		clanMoves = clanMoves;
	}

	function tilesAdjacent(tile1: GameTile | undefined, tile2: GameTile | undefined) {
		//go through each tiles 3 positions and get the min manhattan distance between any two
		return tile1!.positions.some((pos1) =>
			tile2!.positions.some((pos2) => Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) == 1)
		);
	}
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} {clanMoves} let:tile>
		{#if actionStep == 1 && tile.tileId != targetTile && tilesAdjacent( tile, restrictedGameState.tiles.find((tile) => tile.tileId == targetTile) )}
			{#if (tile.clans[restrictedGameState.playerId] ?? 0) > 0}
				<button
					on:click={() => {
						moveTroop(tile);
					}}>Move From</button
				>
			{/if}
			{#if clanMoves.find((move) => move.from == tile.tileId)?.numClans ?? 0 > 0}
				<button
					on:click={() => {
						takeTroopBack(tile);
					}}>Move Back</button
				>
			{/if}
		{/if}
		{#if actionStep == 0 && restrictedGameState.tiles.some(otherTile => 
				tilesAdjacent(tile, otherTile) && tile.tileId != otherTile.tileId && 
				(otherTile.clans[restrictedGameState.playerId] ?? 0) > 0)
		}
			<button
					on:click={() => {
				selectTile(tile.tileId);
					}}>Select</button>
		{/if}
		{#if actionStep == 1 && tile.tileId == targetTile}
			<button
				on:click={() => {
					//reset selected territory
					gameTiles.forEach((tile) => (tile.selected = false));
					actionStep = 0;
					clanMoves = [];
					restrictedGameState = restrictedGameState;
				}}
				style:height="25px">Unselect</button
			>
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
	{#if actionStep == 0}
		<span>Choose a territory</span>
	{:else if actionStep == 1}
		<span>Move clans into chosen territory</span>
	{/if}
	&nbsp;
	{#if actionStep == 1}
		<button
			disabled={clanMoves.length == 0}
			on:click={async () => {
				socket.send(JSON.stringify(await GameActionFactory.conquestActionCard(gameId, clanMoves)));
			}}
			style:height="25px">Submit</button
		>
	{/if}
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar bind:gameUIState={gameUIState} {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
