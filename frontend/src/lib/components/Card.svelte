<script lang="ts">
	import { CardType, type SelectableCard } from '$lib/types/Card';
	import SeasonSymbol from './SeasonSymbol.svelte';
	import TriskalSymbol from './TriskalSymbol.svelte';
	export let card: SelectableCard;
	export let height: string = '200px';
	export let hovering: boolean = false;
	export let selected: boolean = false; //alternate way to make card selected
</script>

<div
	style:border="1px solid black"
	style:display="inline-block"
	style:border-radius=".5rem"
	style:height
	style:aspect-ratio=".75"
	style:background-color={card.type === CardType.Action
		? '#e6ffe6'
		: card.type === CardType.Advantage
			? 'lightyellow'
			: card.type == CardType.EpicTale
				? '#ffe6e6'
				: ''}
	style:border-width={card.selected || selected ? '3px' : '1px'}
	style:overflow="hidden"
>
	<h3 style:text-align="center" style:margin-top="0">{card.name}</h3>
	<img
		alt={card.name + ' image'}
		src={card.imageSrc ?? 'https://attic.sh/w1vb57f8v9kzcxg025gyzdlhqu5k'}
		style:display="block"
		style:margin="auto"
		height="20%"
	/>
	<br />

	<div style:display="flex" style:justify-content="center" style:align-items="center">
		{#if hovering}
			{#if card.isSeason}<p style:margin="0"><SeasonSymbol />{card.seasonMessage}</p>{/if}
			{#if card.isSeason && card.isTriskal}<span
					style:text-align="center"
					style:font-weight="bold"
					style:margin-right="15px">or</span
				>{/if}
			{#if card.isTriskal}<p style:margin="0"><TriskalSymbol />{card.triskalMessage}</p>{/if}
		{:else}
			{#if card.isSeason}<SeasonSymbol />{/if}
			{#if card.isTriskal}<TriskalSymbol />{/if}
		{/if}
	</div>
</div>

<style>
	p {
		white-space: pre-wrap;
	}
</style>
