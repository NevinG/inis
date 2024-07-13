<script lang="ts">
	import { CardType, type Card } from '$lib/types/card';
	import SeasonSymbol from './SeasonSymbol.svelte';
	import TriskalSymbol from './TriskalSymbol.svelte';
	export let card: Card;
</script>

<div
	style:border="1px solid black"
	style:display="inline-block"
	style:padding="10px"
	style:border-radius=".5rem"
	style:width="250px" 
	style:height="400px"
	style:margin="5px"
	style:background-color={card.type === CardType.Action ? '#e6ffe6' : card.type === CardType.Advantage ? 'lightyellow' : card.type == CardType.EpicTale ? 'lightred' : ''}
>
	<div style:position="absolute">
		{#if card.isSeason}
			<SeasonSymbol />
		{/if}
		{#if card.isTriskal}
			<TriskalSymbol />
		{/if}
	</div>
	<h3 style:text-align="center" style:margin-top="0">{card.name}</h3>
	<img
		alt={card.name + " image"}
		src={card.imageSrc ??
			'https://attic.sh/w1vb57f8v9kzcxg025gyzdlhqu5k'}
		style:display="block"
		style:margin="auto"
		height="175px"
	/>
	<div style:height="190px" style:display="flex" style:justify-content="center" style:align-items="center">
	{#if card.isSeason}<p style:margin=0><SeasonSymbol/><br/>{card.seasonMessage}</p>{/if}
	{#if card.isSeason && card.isTriskal}<span style:text-align="center" style:font-weight="bold" style:margin-right="15px">or</span>{/if}
	{#if card.isTriskal}<p style:margin=0><TriskalSymbol/><br/>{card.triskalMessage}</p>{/if}
	</div>
</div>

<style>
	p {
		white-space: pre-wrap;
	}
</style>
