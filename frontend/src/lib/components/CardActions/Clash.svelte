<script lang="ts">
	import { actionCards, advantageCards, epicTaleCards, type SelectableCard } from '$lib/types/Card';
	import { GameActionFactory, type WithdrawClans } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import { allTiles, type GameTile } from '$lib/types/Tile';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	export let restrictedGameState: RestrictedGameState;
	$: gameTiles = restrictedGameState.tiles as (GameTile & { selected: boolean })[];
	$: selectedTile = gameTiles.filter((tile) => tile.selected)[0];
	$: myCards = restrictedGameState.players[restrictedGameState.playerId].hand.map(
		(cardId) => actionCards[cardId] ?? advantageCards[cardId] ?? epicTaleCards[cardId]
	) as SelectableCard[];

	export let socket: WebSocket;
	export let gameId: string;

	let chooseAttack = false;
	let chooseWithdraw = false;

	//clash withdraw stuff
	let withdrawMoves: WithdrawClans = [];

	function moveTroop(tile: GameTile & { selected: boolean }) {
		const move = withdrawMoves.find((move) => move.withdrawTerritory == tile.tileId);

		if (move) {
			move.numClans++;
		} else {
			withdrawMoves.push({ withdrawTerritory: tile.tileId, numClans: 1 });
		}
		withdrawMoves = withdrawMoves;
	}

	function takeTroopBack(tile: GameTile & { selected: boolean }) {
		const move = withdrawMoves.find((move) => move.withdrawTerritory == tile.tileId);
		if (move) {
			move.numClans--;
			if (move.numClans == 0) {
				withdrawMoves = withdrawMoves.filter((move) => move.withdrawTerritory != tile.tileId);
			}
		}
		withdrawMoves = withdrawMoves;
	}

	function tilesAdjacent(tile1: GameTile | undefined, tile2: GameTile | undefined) {
		//go through each tiles 3 positions and get the min manhattan distance between any two
		return tile1!.positions.some((pos1) =>
			tile2!.positions.some((pos2) => Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) == 1)
		);
	}

	function isChiefton(tile: GameTile) {
		let moreClansThan = 0;
		if(!(restrictedGameState.playerId in tile.clans))
			return false;
		const currentTroopsInTerritory = tile.clans[restrictedGameState.playerId] ?? 0;

		Object.values(tile.clans).forEach((clanNum) => {
			moreClansThan += currentTroopsInTerritory > clanNum ? 1 : 0;
		});
		return moreClansThan == Object.values(tile.clans).length - 1;
	}

	async function selectTile(tileId: string) {
		const tile = gameTiles.find((tile) => tile.tileId == tileId);
		if (restrictedGameState.clashes.currentlyResolvingTerritory == "" && restrictedGameState.clashes.instigatorId != restrictedGameState.playerId)
			return;
		
		if(restrictedGameState.clashes.currentlyResolvingTerritory != "")
			return; 

		if (tile!.selected) {
			tile!.selected = false;
		} else {
			//unselect all tiles
			gameTiles.forEach((tile) => (tile.selected = false));
			if (restrictedGameState.clashes.territories.indexOf(tileId) != -1) tile!.selected = true;
		}
		restrictedGameState = restrictedGameState;
	}
</script>

<div style:width="100%" style:height="65%">
	<GameMap
		{restrictedGameState}
		{selectTile}
		clanMoves={withdrawMoves.map((move) => {
			return {
				to: move.withdrawTerritory,
				from: restrictedGameState.clashes.currentlyResolvingTerritory,
				numClans: move.numClans
			};
		})}
		let:tile
	>
		{#if chooseWithdraw && tile.tileId != restrictedGameState.clashes.currentlyResolvingTerritory && tilesAdjacent( tile, restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory) ) && isChiefton(tile)}
			{#if (restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans[restrictedGameState.playerId] ?? 0) - withdrawMoves.reduce((totalFrom, move) => totalFrom + move.numClans, 0) > 0}
				<button
					on:click={() => {
						moveTroop(tile);
					}}>Withdraw To</button
				>
			{/if}
			{#if withdrawMoves.find((move) => move.withdrawTerritory == tile.tileId)?.numClans ?? 0 > 0}
				<button
					on:click={() => {
						takeTroopBack(tile);
					}}>Move Back</button
				>
			{/if}
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
	{#if restrictedGameState.clashes.currentlyResolvingTerritory == ''}
		{#if restrictedGameState.clashes.instigatorId == restrictedGameState.playerId}
			<span>Choose territory to clash with.</span>&nbsp;
		{:else}
			<span
				>{restrictedGameState.players[restrictedGameState.clashes.instigatorId].name} is choosing a territory
				to resolve the next clash in.</span
			>&nbsp;
		{/if}
	{:else}
		<span>
			THIS IS A CLASH in {allTiles[restrictedGameState.clashes.currentlyResolvingTerritory].name}
			<br />
			{restrictedGameState.clashes.instigatorId != restrictedGameState.playerId
				? restrictedGameState.players[restrictedGameState.clashes.playerTurn].name + ' turn'
				: ''}
		</span>&nbsp;
		{#if restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans[restrictedGameState.playerId] ?? 0 > 0}
			<button
				disabled={restrictedGameState.clashes.votedToResolve.indexOf(
					restrictedGameState.playerId
				) != -1}
				on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.clashResolveVote(gameId)));
				}}
			>
				Vote For Resolution ({restrictedGameState.clashes.votedToResolve.length}/{Object.values(
					restrictedGameState.tiles.find(
						(tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory
					)?.clans ?? []
				).filter((val) => val > 0).length})
			</button>&nbsp;
		{/if}
		{#if restrictedGameState.clashes.attackedPlayer && restrictedGameState.clashes.attackedPlayer == restrictedGameState.playerId}
			<button
				on:click={async () => {
					socket.send(
						JSON.stringify(await GameActionFactory.clashAttackResponse(gameId, true, ''))
					);
				}}>Remove Clan</button
			>&nbsp;
			<button
				on:click={async () => {
					const selectedCard = myCards.find((card) => card.selected)?.id;
					if (selectedCard)
						socket.send(
							JSON.stringify(
								await GameActionFactory.clashAttackResponse(gameId, false, selectedCard)
							)
						);
				}}>Remove Action Card</button
			>
		{:else if restrictedGameState.clashes.playerTurn == restrictedGameState.playerId && restrictedGameState.clashes.attackedPlayer == ''}
			{#if chooseAttack}
				<button
					on:click={() => {
						chooseAttack = false;
					}}>Back</button
				>&nbsp;
				{#each Object.entries(restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans ?? {}) as [playerId, clanNum]}
					{#if clanNum > 0 && playerId != restrictedGameState.playerId}
						<button
							on:click={async () => {
								chooseAttack = false;
								socket.send(JSON.stringify(await GameActionFactory.clashAttack(gameId, playerId)));
							}}
						>
							{restrictedGameState.players[playerId].name}
						</button>&nbsp;
					{/if}
				{/each}
			{/if}
			{#if chooseWithdraw}
				<span>Use buttons on screen to withdraw to territories</span>
				<button
					on:click={() => {
						chooseWithdraw = false;
						withdrawMoves = [];
					}}>Back</button
				>&nbsp;
				<button
					disabled={withdrawMoves.length == 0}
					on:click={async () => {
						socket.send(
							JSON.stringify(await GameActionFactory.clashWithdraw(gameId, withdrawMoves))
						);
						chooseWithdraw = false;
						withdrawMoves = [];
					}}>Submit</button
				>
			{/if}
			{#if !chooseAttack && !chooseWithdraw}
				<button
					on:click={() => {
						chooseAttack = true;
					}}>Attack</button
				>&nbsp;
			{/if}
			{#if !chooseAttack && !chooseWithdraw}
				<button
					on:click={() => {
						chooseWithdraw = true;
					}}>Withdraw</button
				>&nbsp;
			{/if}
			{#if !chooseAttack && !chooseWithdraw}
				<button>Epic Tale Manuever</button>&nbsp;
			{/if}
		{/if}
	{/if}
	{#if restrictedGameState.clashes.currentlyResolvingTerritory == '' && restrictedGameState.clashes.instigatorId == restrictedGameState.playerId}
		<button
			disabled={!selectedTile}
			on:click={async () => {
				socket.send(
					JSON.stringify(
						await GameActionFactory.chooseClashingTerritory(gameId, selectedTile.tileId)
					)
				);
			}}
			style:height="25px">Submit</button
		>
	{/if}
</div>
<div style:width="100%" style:height="20%" style:display="flex">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
