<script lang="ts">
	import { actionCards, advantageCards, CardType, epicTaleCards, type SelectableCard } from '$lib/types/Card';
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import PlayerCards from './PlayerCards.svelte';

	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	export let gameId: string;
	export let interactive: boolean = true;

	$: myCards = restrictedGameState.players[restrictedGameState.playerId].hand.map(
		(cardId) => actionCards[cardId] ?? advantageCards[cardId] ?? epicTaleCards[cardId]
	) as SelectableCard[];
</script>

<!-- triskals -->
<div 
  style:width="100%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="center"
>
	{#each restrictedGameState.players[restrictedGameState.playerId].triskalsAvailable as triskal}
		<button
			on:click={async () => {
				socket.send(
					JSON.stringify(
						await GameActionFactory.playTriskalCard(
							gameId,
							triskal
						)
					)
				);
			}}
		>
		Play {(actionCards[triskal] ?? advantageCards[triskal] ?? epicTaleCards[triskal]).name} Triskal</button>
	{/each}
</div>
<div
	style:height="100%"
	style:width="100%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="center"
	style:z-index="2"
>
	<PlayerCards {restrictedGameState} {socket} {gameId}></PlayerCards>
	{#if restrictedGameState.isSeasonPhase && restrictedGameState.playerId == restrictedGameState.seasonPhasePlayerTurn && interactive}
		<div style:padding="5px">
			<button
				on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.pass(gameId)));
				}}>Pass</button
			><br />
			<button
				on:click={
					async () => {
						if (myCards.filter(card => card.type == CardType.Action).length == 1 && ((myCards.find((card) => card.selected)?.id ?? '') == '5')) {
							alert("cant play druid as last action card"); 
							return;
						}; //can't play druid if last actin card

						socket.send(
							JSON.stringify(
								await GameActionFactory.playCard(
									gameId,
									myCards.find((card) => card.selected)?.id ?? ''
								)
							)
						);
					}
				}
				>Play{myCards.find((card) => card.selected)?.id ?? ''}</button
			><br />
			<button
				on:click={async () => {
					socket.send(JSON.stringify(await GameActionFactory.takePretenderToken(gameId)));
				}}>Pretender Token</button
			>
		</div>
	{/if}
</div>
