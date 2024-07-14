<script lang="ts">
	import type { GameState } from "$lib/types/GameState";
  export let data : GameState;
</script>

{#if data.hasStarted}
  <p>The game has started</p>
{:else}
  <h3>Players:</h3>
  {#each Object.entries(data.players) as [_, player]}
    <p>{player.name}</p>
  {/each}
  <button>Start Game</button>
{/if}