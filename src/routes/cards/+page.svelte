<script lang="ts">
	import CardComponent from '$lib/components/Card.svelte';
	export let data;
</script>

<h1>Action Cards</h1>
{#each data.actionCards as card}
	<CardComponent {card} />
{/each}

<h1>Epic Tale Cards</h1>
{#each data.epicTaleCards as card}
	<CardComponent {card} />
{/each}

<h1>Action Advantage Cards</h1>
{#each data.advantageCards as card}
	<CardComponent {card} />
{/each}

