<script lang="ts">
	import { actionCards, advantageCards, epicTaleCards, type SelectableCard } from '$lib/types/Card';
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import PlayerCards from './PlayerCards.svelte';

	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	export let gameId: string;

	$: myCards = restrictedGameState.players[restrictedGameState.playerId].hand.map(
		(cardId) => actionCards[cardId] ?? advantageCards[cardId] ?? epicTaleCards[cardId]
	) as SelectableCard[];
</script>

<div
	style:height="100%"
	style:width="100%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="center"
>
	<PlayerCards {restrictedGameState} {socket} {gameId}></PlayerCards>
	{#if restrictedGameState.isSeasonPhase && restrictedGameState.playerId == restrictedGameState.seasonPhasePlayerTurn}
		<div style:padding="5px">
			<button
				on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.pass(gameId)));
				}}>Pass</button
			><br />
			<button
				on:click={async () => {
					socket.send(
						JSON.stringify(
							await GameActionFactory.playCard(
								gameId,
								myCards.find((card) => card.selected)?.id ?? ''
							)
						)
					);
				}}>Play</button
			><br />
			<button
				on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.takePretenderToken(gameId)));
				}}>Pretender Token</button
			>
		</div>
	{/if}
</div>
