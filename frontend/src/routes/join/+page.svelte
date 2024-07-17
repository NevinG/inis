<script lang="ts">
  export let data;
</script>

<a href="/">back</a>
{#if data.games.length == 0}
<h2>No Games Available</h2>
{/if}
{#each data.games as game}
  <div>Players: {game.currentPlayers} / {game.maxPlayers} <a href="/game/{game.id}"><button>Join Game</button></a></div>
{/each}