<script lang="ts">
	import { actionCards, advantageCards, epicTaleCards, type SelectableCard } from '$lib/types/Card';
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import CitadelAction from './CardActions/CitadelAction.svelte';
	import Clash from './CardActions/Clash.svelte';
	import ConquestAction from './CardActions/ConquestAction.svelte';
	import CraftsmanAndPeasantsAction from './CardActions/CraftsmanAndPeasantsAction.svelte';
	import DruidAction from './CardActions/DruidAction.svelte';
	import ExplorationAction from './CardActions/ExplorationAction.svelte';
	import ExplorationActionBren from './CardActions/ExplorationActionBren.svelte';
	import FestivalAction from './CardActions/FestivalAction.svelte';
	import MigrationAction from './CardActions/MigrationAction.svelte';
	import NewAllianceAction from './CardActions/NewAllianceAction.svelte';
	import NewClansAction from './CardActions/NewClansAction.svelte';
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

	//removes selected from all cards.
	$: if (restrictedGameState.currentlyPlayingCard == '') {
		restrictedGameState.players[restrictedGameState.playerId].hand.forEach((cardId) => {
			(
				(actionCards[cardId] ?? epicTaleCards[cardId] ?? advantageCards[cardId]) as SelectableCard
			).selected = false;
		});
	}

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
	<!-- render clash -->
	{#if restrictedGameState.clashes.instigatorId} 
		<Clash {restrictedGameState} {socket} {gameId} />
	<!-- render specific action cards on your turn -->
	{:else if restrictedGameState.currentlyPlayingCard && restrictedGameState.seasonPhasePlayerTurn == restrictedGameState.playerId}
		<!-- Sanctuary render -->
		{#if restrictedGameState.currentlyPlayingCard == '12'}
			<SanctuaryAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '2'}
			<CitadelAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '3'}
			<ConquestAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '4'}
			<CraftsmanAndPeasantsAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '5'}
			<DruidAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '6'}
			{#if restrictedGameState.bren == restrictedGameState.playerId}
				<ExplorationActionBren {restrictedGameState} {socket} {gameId} />
			{:else}
				<ExplorationAction {restrictedGameState} {socket} {gameId} />
			{/if}
		{:else if restrictedGameState.currentlyPlayingCard == '7'}
			<FestivalAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '9'}
			<MigrationAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '10'}
			<NewAllianceAction {restrictedGameState} {socket} {gameId} />
		{:else if restrictedGameState.currentlyPlayingCard == '11'}
			<NewClansAction {restrictedGameState} {socket} {gameId} />
		{:else}
			<p>Action of card {currentCard.name} isn't implemented yet</p>
		{/if}
		<!-- Default render -->
	{:else if restrictedGameState.bren == restrictedGameState.playerId && restrictedGameState.currentlyPlayingCard == '6'}
		<ExplorationActionBren {restrictedGameState} {socket} {gameId} />
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
