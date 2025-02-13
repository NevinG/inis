<script lang="ts">
	import {
		actionCards,
		advantageCards,
		CardType,
		epicTaleCards,
		type SelectableCard
	} from '$lib/types/Card';
	import type { GameUIState, RestrictedGameState } from '$lib/types/GameState';
	import CardComponent from '$lib/components/Card.svelte';
	import { GameActionFactory } from '$lib/types/GameActions';

	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	export let gameId: string;
	export let gameUIState: GameUIState;

	$: myCards = restrictedGameState.players[restrictedGameState.playerId].hand.map(
		(cardId) => actionCards[cardId] ?? advantageCards[cardId] ?? epicTaleCards[cardId]
	) as SelectableCard[];
	$: myActionCards = myCards.filter((card) => card.type == CardType.Action);
	$: myEpicTaleCards = myCards.filter((card) => card.type == CardType.EpicTale);
	$: myAdvantageCards = myCards.filter((card) => card.type == CardType.Advantage);

	function toggleSelectCard(card: SelectableCard) {
		//if we are drafting, only allow selecting action cards
		if (restrictedGameState.isDrafting && !(card.id in actionCards)) 
			return;

		//can't select cards if we already selected them
		if (restrictedGameState.isDrafting && myActionCards.length == restrictedGameState.cardsToDraft)
			return;

		if (!restrictedGameState.isDrafting) {
			//remove selection from all other cards
			if(gameUIState.selectedCards.includes(card.id)) {
				gameUIState.selectedCards = [];
			} else {
				gameUIState.selectedCards = [card.id];
			}
		} else {
			if (gameUIState.selectedCards.includes(card.id)) {
				gameUIState.selectedCards = gameUIState.selectedCards.filter((c) => c != card.id);
			} else {
				gameUIState.selectedCards.push(card.id);
			}
		}

		gameUIState = gameUIState;
	}
	$: console.log(gameUIState)
</script>

<div
	style:height="100%"
	style:display="flex"
	style:justify-content="center"
	style:align-items="end"
	style:gap="2px"
>
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
			<CardComponent
				selected={gameUIState.selectedCards.includes(actionCard.id)}
				hovering={actionCard.hovering}
				card={actionCard}
				height="100%"
			></CardComponent>
		</div>
	{/each}

	{#each myEpicTaleCards as epicTaleCard}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<div
			class="cardParent"
			style:height={epicTaleCard.hovering ? '200%' : '100%'}
			on:mouseover={() => {
				epicTaleCard.hovering = true;
			}}
			on:mouseleave={() => {
				epicTaleCard.hovering = false;
			}}
			on:click={() => {
				toggleSelectCard(epicTaleCard);
			}}
		>
			<CardComponent
				selected={gameUIState.selectedCards.includes(epicTaleCard.id)}
				hovering={epicTaleCard.hovering}
				card={epicTaleCard}
				height="100%"
			></CardComponent>
		</div>
	{/each}

	{#each myAdvantageCards as advantageCard}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<div
			class="cardParent"
			style:height={advantageCard.hovering ? '200%' : '100%'}
			on:mouseover={() => {
				advantageCard.hovering = true;
			}}
			on:mouseleave={() => {
				advantageCard.hovering = false;
			}}
			on:click={() => {
				toggleSelectCard(advantageCard);
			}}
		>
			<CardComponent
				selected={gameUIState.selectedCards.includes(advantageCard.id)}
				hovering={advantageCard.hovering}
				card={advantageCard}
				height="100%"
			></CardComponent>
		</div>
	{/each}

	{#if restrictedGameState.isDrafting && myActionCards.length != restrictedGameState.cardsToDraft}
		<button
			style:height="30px"
			disabled={gameUIState.selectedCards.filter(x => x in actionCards).length !==
				restrictedGameState.cardsToDraft}
			on:click={async () => {
				socket.send(
					JSON.stringify(
						await GameActionFactory.draftCards(
							gameId,
							gameUIState.selectedCards,
						)
					)
				);
				//remove selection from all other cards
				gameUIState.selectedCards = [];
				gameUIState = gameUIState;
			}}
			>Draft Cards ({gameUIState.selectedCards.length}/{restrictedGameState.cardsToDraft})</button
		>
	{/if}
</div>
