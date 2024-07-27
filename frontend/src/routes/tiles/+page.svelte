<script lang="ts">
	import Hex from '$lib/components/Hex.svelte';
	export let data;
</script>

<a href="/">back</a>
<h1>Tiles</h1>
{#each data.tiles as tile}
	<Hex/>
{/each}
