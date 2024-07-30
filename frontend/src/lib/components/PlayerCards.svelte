<script lang="ts">
	import { CardType, type SelectableCard } from '$lib/types/Card';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import CardComponent from '$lib/components/Card.svelte';
	import { GameActionFactory } from '$lib/types/GameActions';

	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	export let gameId: string;

	$: myCards = restrictedGameState.players[restrictedGameState.playerId].hand as SelectableCard[];
	$: myActionCards = myCards.filter((card) => card.type == CardType.Action);
	$: myEpicTaleCards = myCards.filter((card) => card.type == CardType.EpicTale);
	$: myAdvantageCards = myCards.filter((card) => card.type == CardType.Advantage);

	function toggleSelectCard(card: SelectableCard) {
		card.selected = !(card.selected ?? false);
		myCards = myCards;
	}
</script>

<div
	style:width="100%"
	style:height="100%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="end"
	style:gap="3px"
>
	{#if restrictedGameState.isDrafting}
		{#each myActionCards as actionCard}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			<div
				class="cardParent"
				style:height={actionCard.hovering ? '200%' : '100%'}
				on:mouseover={() => {
					actionCard.hovering = true;
				}}
				on:mouseleave={() => {
					actionCard.hovering = false;
				}}
				on:click={() => {
					toggleSelectCard(actionCard);
				}}
			>
				<CardComponent hovering={actionCard.hovering} card={actionCard} height="100%"
				></CardComponent>
			</div>
		{/each}
	{:else}
		{#each myActionCards as actionCard}
			<CardComponent card={actionCard} height="100%"></CardComponent>
		{/each}
	{/if}

	{#each myEpicTaleCards as epicTaleCard}
		<CardComponent card={epicTaleCard} height="100%"></CardComponent>
	{/each}
	{#each myAdvantageCards as advantageCard}
		<CardComponent card={advantageCard} height="100%"></CardComponent>
	{/each}

	{#if restrictedGameState.isDrafting}
		<button
			style:height="30px"
			disabled={myActionCards.filter((card) => card.selected).length !==
				restrictedGameState.cardsToDraft}
			on:click={async () => {
				socket.send(
					JSON.stringify(
						await GameActionFactory.draftCards(
							gameId,
							myCards.filter((card) => card.selected).map((card) => card.id)
						)
					)
				);
			}}
			>Draft Cards ({myActionCards.filter((card) => card.selected)
				.length}/{restrictedGameState.cardsToDraft})</button
		>
	{/if}
</div>
