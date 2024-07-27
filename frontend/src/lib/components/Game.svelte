<script lang="ts">
	import { actionCards, CardType, type SelectableCard } from '$lib/types/Card';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import CardComponent from '$lib/components/Card.svelte';
	import { GameActionFactory } from '$lib/types/GameActions';
  import Hex from "$lib/components/Hex.svelte";
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

	const tileWidth = 90;
	const tileHeight = (tileWidth * Math.sqrt(3)) / 1.5;

	let tileMapOffset = { x: 0, y: 0 }; //used for dragging around the gameboard
</script>

<!-- Render gameboard tiles -->
<!-- TODO: make the height not just 200px, but dynamic and cool -->
<div style:width={"100%"} style:height={"200px"}>
	{#each Object.entries(restrictedGameState.players) as [_, player]}
		<div
		  style:width = "20px"
		  style:height = "20px"
			style:background-color = "blue"
			style:display = "inline-block"
			style:margin = "5px"
		>
		</div>
	{/each}
</div>
<!--TODO: make height not just 500px, but dynamic and cool-->
<div 
  style:width={"100%"} 
	style:height={"500px"} 
	style:overflow="clip"
>
	<!--This div is draggable-->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:mousemove={(e) => {
			if(e.buttons !== 1)
				return
			tileMapOffset.x += e.movementX;
			tileMapOffset.y += e.movementY;
		}}
		style:cursor="move"
		style:transform={`translate(${tileMapOffset.x}px, ${tileMapOffset.y}px)`}
	> 
	{#each restrictedGameState.tiles as tile}
	  {#each tile.positions as {x, y}}
			<div 
				style:position="absolute" 
				style:left={`calc(50% + ${x*tileWidth/2 -y*tileWidth/2}px)`}
				style:top={`${250 - (x*tileHeight/1.5 + y*tileHeight/1.5)}px`}
			>
				<Hex width={tileWidth} color={tile.tile.color}/>
			</div>
		{/each}
		<!-- positioned by taking the average x position of the three tiles and average y pos of the three tiles -->
		<div 
		  style:width={`${tileWidth}px`} 
			style:height={`${tileHeight}px`} 
			style:position="absolute"
			style:left={`calc(50% + ${(tile.positions.reduce((x, cur) => x + cur.x,0)/3)*tileWidth/2 -(tile.positions.reduce((y, cur) => y + cur.y,0)/3)*tileWidth/2}px)`}
			style:top={`${250 - ((tile.positions.reduce((x, cur) => x + cur.x,0)/3)*tileHeight/1.5 + (tile.positions.reduce((y, cur) => y + cur.y,0)/3)*tileHeight/1.5)}px`}
		>
			<p style:text-align="center">{tile.tile.name}</p>
			<p style:text-align="center">{tile.tile.text ?? ""}</p>
		</div>
	{/each}
	</div>
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
