<script lang="ts">
	import type { RestrictedGameState } from '$lib/types/GameState';

	export let restrictedGameState: RestrictedGameState;
</script>

<style>
  .card {
    margin: 1px;
    width: 15px;
    height: 30px;
    background-color: green;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

<div style:display="flex">
	{#each Object.entries(restrictedGameState.players) as [_, player]}
		<div style:display="inline-block" style:margin="0 5px">
			<!-- Player Name -->
			<span
				style:margin-left="5px"
				style:font-weight={player.id == restrictedGameState.playerId ? 'bold' : 'normal'}
				>{player.name}</span
			>
			<!-- Player's Cards -->
      <div style:display="flex">
        <div class="card" style:background-color="green">
          {player.actionCards}
        </div>
        <div class="card" style:background-color="red">
          {player.epicTaleCards}
        </div>
        <div class="card" style:background-color="yellow">
          {player.advantageCards}
        </div>
      </div>
			<!-- Players Clan Reserve -->
      <p style:margin="0 1px">Cn: {player.reserveClans}</p>
			{#if restrictedGameState.bren == player.id}<p style:margin="0 1px">Bren</p>{/if}
		</div>
	{/each}
</div>

<!-- Render game data-->
<div>
	<span
		>Flock of crows: {restrictedGameState.flockOfCrowsIsClockwise
			? 'clockwise'
			: 'counter-clockwise'}</span
	>
	{#if restrictedGameState.brenPickingCapital}<p>Bren is picking capital</p>{/if}
</div>
