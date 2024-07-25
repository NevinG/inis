<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';

	export let restrictedGameState: RestrictedGameState;
	export let gameId: string;
	export let socket;

	let countdown = 10;
	$: if (restrictedGameState && restrictedGameState.tenSecondStartingCountdown) {
		countdown = 10;
		startCountdown();
	}

	function startCountdown() {
		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) clearInterval(interval);
		}, 1000);
	}

	let name = '';
</script>

<h3>Players:</h3>
{#each Object.entries(restrictedGameState.players) as [_, player]}
	<p style:font-weight={restrictedGameState.playerId === player.id ? 'bold' : 'normal'}>
		{player.name}
	</p>
{/each}
{#if !(restrictedGameState.playerId in restrictedGameState.players)}
	<input type="text" placeholder="Enter your name" bind:value={name} />
	<button
		on:click={async () => {
			socket.send(JSON.stringify(await GameActionFactory.joinGame(gameId, name)));
		}}>Join Game</button
	>
{/if}
{#if restrictedGameState.playerId in restrictedGameState.players && !restrictedGameState.players[restrictedGameState.playerId].ready}
	<button
		on:click={async () => {
			socket.send(JSON.stringify(await GameActionFactory.readyUp(gameId)));
		}}>Ready</button
	>
{:else}
	<button
		on:click={async () => {
			socket.send(JSON.stringify(await GameActionFactory.unreadyUp(gameId)));
		}}>UnReady</button
	>
{/if}
{#if restrictedGameState.tenSecondStartingCountdown}
	Starting in {countdown} seconds...
{/if}
<p>
	Ready: {Object.keys(restrictedGameState.players).filter(
		(player) => restrictedGameState.players[player].ready
	).length}/{Object.keys(restrictedGameState.players)?.length ?? 0}
</p>
