<script lang="ts">
  import Tile from '$lib/components/Tile.svelte';
  export let data;
</script>

<a href="/">back</a>
<h1>Tiles</h1>
{#each data.tiles as tile}
  <Tile tile={tile}/>
{/each}
