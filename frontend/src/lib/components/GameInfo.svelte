<script lang="ts">
	import type { RestrictedGameState } from '$lib/types/GameState';

	export let restrictedGameState: RestrictedGameState;
</script>

<div style:display="flex">
	{#each Object.values(restrictedGameState.players) as player}
		<div
			style:display="inline-block"
			style:margin="0 5px"
			style:border={restrictedGameState.seasonPhasePlayerTurn == player.id ? '1px solid black' : ''}
		>
			<!-- Player Name -->
			<div
				style:padding="3px"
				style:border-radius="5px"
				style:font-weight={player.id == restrictedGameState.playerId ? 'bold' : 'normal'}
				style:background-color={player.color}
			>
				{player.name}
			</div>
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
			<!-- Display if bren -->
			{#if restrictedGameState.bren == player.id}<p style:margin="0 1px">Bren</p>{/if}
			<!-- Display if has pretender token -->
			{#if player.hasPretenderToken}<p style:margin="0 1px">Pretender Token</p>{/if}
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
