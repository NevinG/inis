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
	{#if restrictedGameState.clashes.currentlyResolvingTerritory == ""}
		{#if restrictedGameState.clashes.instigatorId == restrictedGameState.playerId}
			<span>Choose territory to clash with.</span>&nbsp;
		{:else}
			<span>{restrictedGameState.players[restrictedGameState.clashes.instigatorId].name} is choosing a territory to resolve the next clash in.</span>&nbsp;
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
			}}>Remove Clan</button>&nbsp;
			<button on:click={async () => { //TODO: test if I need this line or if it does anything
				myCards = myCards;
				const selectedCard = myCards.find(card => card.selected)?.id;
				if(selectedCard)
					socket.send(JSON.stringify(await GameActionFactory.clashAttackResponse(gameId, false, selectedCard)));
			}}>Remove Action Card</button>
		{:else if restrictedGameState.clashes.playerTurn == restrictedGameState.playerId && restrictedGameState.clashes.attackedPlayer == ""}
			{#if choseAttack}
				<button on:click={() => {choseAttack = false}}>Back</button>&nbsp;
				{#each Object.entries(restrictedGameState.tiles.find((tile) => tile.tileId == restrictedGameState.clashes.currentlyResolvingTerritory)?.clans ?? {}) as [playerId, clanNum]}
					{#if clanNum > 0 && playerId != restrictedGameState.playerId}
						<button on:click={async () => {
							socket.send(JSON.stringify(await GameActionFactory.clashAttack(gameId, playerId)));
						}}>
						{restrictedGameState.players[playerId].name}
						</button>&nbsp;
					{/if}
				{/each}	
			{/if}
			{#if !choseAttack}
			<button on:click={() => {choseAttack = true}}>Attack</button>&nbsp;
			{/if}
			{#if !choseAttack}
			<button>Withdraw</button>&nbsp;
			{/if}
			{#if !choseAttack}
			<button>Epic Tale Manuever</button>
			{/if}
		{/if}
	{/if}
	{#if (restrictedGameState.clashes.currentlyResolvingTerritory == "" && restrictedGameState.clashes.instigatorId == restrictedGameState.playerId)}
		<button
			disabled={!selectedTile}
			on:click={async () => {
				socket.send(
					JSON.stringify(await GameActionFactory.chooseClashingTerritory(gameId, selectedTile.tileId))
				);
			}}
			style:height="25px">Submit</button
		>
	{/if}
</div>
<div style:width="100%" style:height="20%" style:display="flex">
	<GameBottomBar {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
