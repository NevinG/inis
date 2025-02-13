<script lang="ts">
	import { actionCards, advantageCards, epicTaleCards, type SelectableCard } from '$lib/types/Card';
	import type { GameUIState, RestrictedGameState } from '$lib/types/GameState';
	import GameBottomBar from '../GameBottomBar.svelte';
	import GameMap from '../GameMap.svelte';
	import CardComponent from '$lib/components/Card.svelte';
	import { GameActionFactory } from '$lib/types/GameActions';

	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	export let gameId: string;
	export let gameUIState: GameUIState;

	//remove selection from all other cards
	restrictedGameState.discardedCards.forEach((cardId) => {
		(
			(actionCards[cardId] ?? epicTaleCards[cardId] ?? advantageCards[cardId]) as SelectableCard
		).selected = false;
	});

	let hoveringCard: string = '';
	let selectedCard: string = '';
</script>

<div style:width="100%" style:height="40%">
	<GameMap {restrictedGameState} />
</div>
<div
	style:width="100%"
	style:height="20%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="end"
	style:gap="2px"
>
	{#each restrictedGameState.discardedCards as cardId}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="cardParent"
			style:z-index="2"
			style:height={cardId == hoveringCard ? '200%' : '100%'}
			on:mouseover={() => {
				hoveringCard = cardId;
			}}
			on:mouseleave={() => {
				hoveringCard = '';
			}}
			on:click={() => {
				selectedCard = cardId;
			}}
		>
			<CardComponent
				hovering={cardId == hoveringCard}
				selected={cardId == selectedCard}
				card={actionCards[cardId] ?? epicTaleCards[cardId] ?? advantageCards[cardId]}
				height="100%"
			></CardComponent>
		</div>
	{/each}
</div>
<div
	style:width="-webkit-fill-available"
	style:height="5%"
	style:padding-bottom="10px"
	style:bottom="40%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="center"
>
	<span>Select a card from the discard pile to add to your hand</span>&nbsp;
	<button
		on:click={async () => {
			socket.send(JSON.stringify(await GameActionFactory.druidActionCard(gameId, selectedCard)));
		}}
		style:height="25px">Submit</button
	>
</div>
<div style:width="100%" style:height="20%">
	<GameBottomBar bind:gameUIState={gameUIState} {restrictedGameState} {socket} {gameId} interactive={false} />
</div>
