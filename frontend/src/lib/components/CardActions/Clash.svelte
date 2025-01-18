<script lang="ts">
	import { actionCards, advantageCards, epicTaleCards, type SelectableCard } from '$lib/types/Card';
	import { GameActionFactory } from '$lib/types/GameActions';
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

	let choseAttack = false;
	let choseWithdraw = false;
	let withdrawMoves: { from: string; to: string; numClans: number }[] = [];

	const resetClashChoices = () => {
		choseAttack = false;
		choseWithdraw = false;
	}

	export async function selectTile(tileId: string) {
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

	function moveClan(tile: GameTile & { selected: boolean }) {
		const move = withdrawMoves.find((move) => move.to == tile.tileId);
		if (move) {
			move.numClans++;
		} else {
			withdrawMoves.push({ from: restrictedGameState.clashes.currentlyResolvingTerritory, to: tile.tileId, numClans: 1 });
		}
		withdrawMoves = withdrawMoves;
	}

	function takeClanBack(tile: GameTile & { selected: boolean }) {
		const move = withdrawMoves.find((move) => move.to == tile.tileId);
		if (move) {
			move.numClans--;
			if (move.numClans == 0) {
				withdrawMoves = withdrawMoves.filter((move) => move.to != tile.tileId);
			}
		}
		withdrawMoves = withdrawMoves;
	}

	function tilesAdjacent(tile1: GameTile | undefined, tile2: GameTile | undefined) {
		return tile1!.positions.some((pos1) =>
			tile2!.positions.some((pos2) => Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) == 1)
		);
	}

	function isChieftain(tileId: string): boolean {
		const tile = gameTiles.find((tile) => tile.tileId == tileId);
		if (!tile) return false;
		const clans = tile.clans;
		const playerClans = clans[restrictedGameState.playerId] || 0;
		return Object.values(clans).every((numClans) => playerClans >= numClans);
	}
</script>

<div style:width="100%" style:height="65%">
	<GameMap {restrictedGameState} {selectTile} clanMoves={withdrawMoves} let:tile>
		{#if choseWithdraw && tile.tileId != restrictedGameState.clashes.currentlyResolvingTerritory && tilesAdjacent(tile, restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)) && isChieftain(tile.tileId)}
			{#if (restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans[restrictedGameState.playerId] ?? 0) - withdrawMoves.reduce((totalFrom, move) => (move.from == restrictedGameState.clashes.currentlyResolvingTerritory ? move.numClans + totalFrom : totalFrom), 0) > 0}
				<button
					on:click={() => {
						moveClan(tile);
					}}>Move To</button
				>
			{/if}
			{#if withdrawMoves.find((move) => move.to == tile.tileId)?.numClans ?? 0 > 0}
				<button
					on:click={() => {
						takeClanBack(tile);
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
  {#if restrictedGameState.currentlyPlayingTriskalCard == "13" && restrictedGameState.playerTurnForResolvingTriskal == restrictedGameState.playerId}
		<div>
			<span>Choose who's turn it is: </span>
			{#each Object.entries(restrictedGameState.tiles.find(tile => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans ?? {}).filter(([pid, clans]) => (clans ?? 0) > 0) as [pid, _]}
			 <button on:click={async () => {
				socket.send(JSON.stringify(await GameActionFactory.warlordTriskalActionCard(gameId, pid)));
				resetClashChoices();
			}}>{restrictedGameState.players[pid].name}</button>
			{/each}
		</div>
	{:else if restrictedGameState.clashes.currentlyResolvingTerritory == ""}
		{#if restrictedGameState.clashes.instigatorId == restrictedGameState.playerId}
			<span>Choose territory to clash with.</span>&nbsp;
		{:else}
			<span>{restrictedGameState.players[restrictedGameState.clashes.instigatorId].name} is choosing a territory to resolve the next clash in.</span>&nbsp;
		{/if}
	{:else if !restrictedGameState.clashes.citadelStageOver}
	  {#if restrictedGameState.clashes.playerTurn == restrictedGameState.playerId}
			<div>You are the instigator so you don't get to go play in citadels</div>
		{:else}
		  {#if restrictedGameState.clashes.citadelPlayerTurn == restrictedGameState.playerId}
				<div>Would you like to put a clan in a citadel?</div>&nbsp;
				<button on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.clashMoveToCitadel(gameId)));
					resetClashChoices();
				}}>Yes</button>&nbsp;

				<button on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.clashDonePlacingInCitadels(gameId)));
					resetClashChoices();
				}}>No</button>
			{/if}
		{/if}
	{:else}
		<span>
			THIS IS A CLASH in {allTiles[restrictedGameState.clashes.currentlyResolvingTerritory].name}
			<br>
			{restrictedGameState.clashes.instigatorId != restrictedGameState.playerId ? restrictedGameState.players[restrictedGameState.clashes.playerTurn].name  + " turn" : ""}
		</span>&nbsp;
		{#if restrictedGameState.clashes.attackedPlayer && restrictedGameState.clashes.attackedPlayer == restrictedGameState.playerId}
			<button on:click={async () => {
				socket.send(JSON.stringify(await GameActionFactory.clashAttackResponse(gameId, true, "")));
				resetClashChoices();
			}}>Remove Clan</button>&nbsp;
			<button on:click={async () => { //TODO: test if I need this line or if it does anything
				myCards = myCards;
				const selectedCard = myCards.find(card => card.selected)?.id;
				if(selectedCard)
					socket.send(JSON.stringify(await GameActionFactory.clashAttackResponse(gameId, false, selectedCard)));
					resetClashChoices();
			}}>Remove Action Card</button>
		{:else if restrictedGameState.clashes.playerTurn == restrictedGameState.playerId && restrictedGameState.clashes.attackedPlayer == ""}
			{#if choseAttack}
				<button on:click={() => {choseAttack = false}}>Back</button>&nbsp;
				{#each Object.entries(restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans ?? {}) as [playerId, clanNum]}
					{#if clanNum > 0 && playerId != restrictedGameState.playerId}
						<button on:click={async () => {
							socket.send(JSON.stringify(await GameActionFactory.clashAttack(gameId, playerId)));
							resetClashChoices();
						}}>
						{restrictedGameState.players[playerId].name}
						</button>&nbsp;
					{/if}
				{/each}
			{/if}
			{#if !choseAttack && !choseWithdraw}
				<button on:click={() => {choseAttack = true}}>Attack</button>&nbsp;
				<button on:click={() => {choseWithdraw = true}}>Withdraw</button>&nbsp;
				<button>Epic Tale Manuever</button>
			{/if}
			{#if choseWithdraw}
				<button on:click={() => {choseWithdraw = false; withdrawMoves = []; gameTiles.forEach((tile) => (tile.selected = false));}}>Undo Withdraw</button>&nbsp;
				<button disabled={withdrawMoves.length == 0} on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.withdraw(gameId, withdrawMoves)));
					choseWithdraw = false; withdrawMoves = []; gameTiles.forEach((tile) => (tile.selected = false));
					resetClashChoices();
				}}>Submit Withdraw</button>
			{/if}
		{/if}
		{#if restrictedGameState.clashes.attackedPlayer == "" && (restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans[restrictedGameState.playerId] ?? 0) > 0}
			{#if Object.values(restrictedGameState.clashes.votesToResolve).reduce((a,b) => a && b, true)} <!--If only voted to resolve clash so far -->
				&nbsp;<button
				  disabled={restrictedGameState.clashes.votesToResolve[restrictedGameState.playerId]}
					on:click={async () => {
						socket.send(JSON.stringify(await GameActionFactory.clashVoteToResolve(gameId, true)));
						resetClashChoices();
					}}
				>Vote to resolve ({Object.values(restrictedGameState.clashes.votesToResolve).length} votes)</button>&nbsp;
				<button
				  disabled={restrictedGameState.clashes.votesToResolve[restrictedGameState.playerId]}
					on:click={async () => {
						socket.send(JSON.stringify(await GameActionFactory.clashVoteToResolve(gameId, false)));
						resetClashChoices();
					}}
				>Vote to not resolve</button>
			{:else}
				<span>Someone voted against resolving clash</span>
			{/if}
		{/if}
	{/if}
	{#if (restrictedGameState.clashes.currentlyResolvingTerritory == "" && restrictedGameState.clashes.instigatorId == restrictedGameState.playerId)}
		<button
			disabled={!selectedTile}
			on:click={async () => {socket.send(JSON.stringify(await GameActionFactory.chooseClashingTerritory(gameId, selectedTile.tileId)));
				resetClashChoices();
			}}
			style:height="25px">Submit</button
		>
	{/if}
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
