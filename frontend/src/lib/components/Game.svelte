<script lang="ts">
	import { actionCards, advantageCards, epicTaleCards } from '$lib/types/Card';
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import SanctuaryAction from './CardActions/SanctuaryAction.svelte';
	import GameBottomBar from './GameBottomBar.svelte';
	import GameMap from './GameMap.svelte';
	import GameTopBar from './GameTopBar.svelte';
	export let restrictedGameState: RestrictedGameState;
	$: currentCard =
		actionCards[restrictedGameState.currentlyPlayingCard] ??
		advantageCards[restrictedGameState.currentlyPlayingCard] ??
		epicTaleCards[restrictedGameState.currentlyPlayingCard];

	export let socket: WebSocket;
	export let gameId: string;

	async function selectTile(tileId: string) {
		if (
			restrictedGameState.brenPickingCapital &&
			restrictedGameState.bren == restrictedGameState.playerId
		) {
			socket.send(JSON.stringify(await GameActionFactory.pickCapitalTerritory(gameId, tileId)));
		} else if (
			restrictedGameState.placeInitialClans &&
			restrictedGameState.placeClanTurn == restrictedGameState.playerId
		) {
			socket.send(JSON.stringify(await GameActionFactory.placeInitialClan(gameId, tileId)));
		}
	}
</script>

{#if restrictedGameState.winner == ''}
	<div style:width="100%" style:height="15%" style:display="flex">
		<GameTopBar {restrictedGameState} />
	</div>
	<!-- Render game for performing specific action -->
	{#if restrictedGameState.currentlyPlayingCard && restrictedGameState.seasonPhasePlayerTurn == restrictedGameState.playerId}
		<!-- Sanctuary render -->
		{#if restrictedGameState.currentlyPlayingCard == '12'}
			<SanctuaryAction {restrictedGameState} {socket} {gameId} />
		{:else}
			<p>Action of card {currentCard.name} isn't implemented yet</p>
		{/if}
		<!-- Default render -->
	{:else}
		<div style:width="100%" style:height="65%">
			<GameMap {restrictedGameState} {selectTile} />
		</div>
		<div style:width="100%" style:height="20%" style:display="flex">
			<GameBottomBar {restrictedGameState} {socket} {gameId} />
		</div>
	{/if}
{:else}
	<p>Game Over! The winner is {restrictedGameState.players[restrictedGameState.winner].name}</p>
{/if}
