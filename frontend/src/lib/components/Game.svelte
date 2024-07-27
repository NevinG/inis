<script lang="ts">
	import { actionCards, CardType, type SelectableCard } from '$lib/types/Card';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import CardComponent from '$lib/components/Card.svelte';
	import { GameActionFactory } from '$lib/types/GameActions';
  import TileComponent from "$lib/components/Tile.svelte";
	export let restrictedGameState: RestrictedGameState;
	export let socket;
	export let gameId: string;

	$: myCards = restrictedGameState.players[restrictedGameState.playerId].hand as SelectableCard[];
	$: myActionCards = myCards.filter((card) => card.type == CardType.Action);
	$: myEpicTaleCards = myCards.filter((card) => card.type == CardType.EpicTale);
	$: myAdvantageCards = myCards.filter((card) => card.type == CardType.Advantage);

	function toggleSelectCard(card: SelectableCard) {
		card.selected = !(card.selected ?? false);
		myCards = myCards;
	}

	const tileWidth = 180;
	const tileHeight = (tileWidth /2 ) / (Math.pow(3,.5) / 2) + Math.pow(3,.5)*(tileWidth/6);
</script>

<!-- Render gameboard tiles -->
<div style:width={"100%"} style:height={"500px"}> <!--TODO: make height not just 500px, but dynamic and cool-->
	{#each Object.entries(restrictedGameState.placedTiles) as [position, tile]}
		<div 
		style:position="absolute" 
		style:left={`calc(${position.split(',').map(x => parseInt(x))[0] * tileWidth + (position.split(',').map(x => parseInt(x)).reduce((partialSum, a) => partialSum + a, 0) % 2 == 1 ? -tileWidth/4 : 0)}px + 50%)`}
		style:top={`calc(${position.split(',').map(x => parseInt(x))[1] * -tileHeight + (position.split(',').map(x => parseInt(x)).reduce((partialSum, a) => partialSum + a, 0) % 2 == 1 ? -tileHeight/4 : 0)}px + 200px)`}>
			<TileComponent 
			  width={180} 
				tile={tile}
				variant={position.split(',').map(x => parseInt(x)).reduce((partialSum, a) => partialSum + a, 0) % 2 == 1}
			></TileComponent>
			{position}
		</div>
	{/each}
</div>

<!-- render your cards -->
<div>
	{#if restrictedGameState.isDrafting}
		{#each myActionCards as actionCard}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				style:display="inline-block"
				on:click={() => {
					toggleSelectCard(actionCard);
				}}
			>
				<CardComponent card={actionCard}></CardComponent>
			</div>
		{/each}
	{:else}
		{#each myActionCards as actionCard}
			<CardComponent card={actionCard}></CardComponent>
		{/each}
	{/if}

	{#each myEpicTaleCards as epicTaleCard}
		<CardComponent card={epicTaleCard}></CardComponent>
	{/each}
	{#each myAdvantageCards as advantageCard}
		<CardComponent card={advantageCard}></CardComponent>
	{/each}

	{#if restrictedGameState.isDrafting}
		<button
		  disabled={myActionCards.filter((card) => card.selected).length !== restrictedGameState.cardsToDraft}
			on:click={async () => {
				socket.send(
					JSON.stringify(
						await GameActionFactory.draftCards(
							gameId,
							myCards.filter((card) => card.selected).map((card) => card.id)
						)
					)
				);
			}}>Draft Cards ({myActionCards.filter((card) => card.selected).length}/{restrictedGameState.cardsToDraft})</button
		>
	{/if}
</div>
