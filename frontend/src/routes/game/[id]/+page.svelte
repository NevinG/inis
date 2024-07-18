<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions.js';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import { api } from '$lib/util/api.js';
	import { onMount } from 'svelte';

	let restrictedGameState: RestrictedGameState;
	export let data;

	// Create WebSocket connection.
	let socket: WebSocket;
	onMount(async () => {
		await api.getAuth();
		socket = new WebSocket('ws://localhost:8080');
		// Connection opened
		socket.addEventListener('open', async () => {
			socket.send(JSON.stringify(await GameActionFactory.viewGame(data.id)));
		});

		// Listen for messages
		socket.addEventListener('message', async (event) => {
			const response = JSON.parse(event.data) as RestrictedGameState;
			restrictedGameState = response as RestrictedGameState;
		});
	});

	let countdown : number = 10;
	$: if(restrictedGameState && restrictedGameState.tenSecondStartingCountdown) {
		countdown = 10;
		startCountdown();
	}

	function startCountdown(){
		const interval = setInterval(() => {
			countdown--;
			if(countdown <= 0)
				clearInterval(interval);
		}, 1000)
	}

	let name = '';
</script>

{#if restrictedGameState !== undefined && restrictedGameState !== null}
	{#if restrictedGameState.hasStarted}
		<p>The game has started</p>
	{:else}
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
					socket.send(JSON.stringify(await GameActionFactory.joinGame(data.id, name)));
				}}>Join Game</button
			>
		{/if}
		{#if restrictedGameState.playerId in restrictedGameState.players && !restrictedGameState.players[restrictedGameState.playerId].ready}
		<button
			on:click={async () => {
				socket.send(JSON.stringify(await GameActionFactory.readyUp(data.id)));
			}}>Ready</button>
		{:else}
		<button
			on:click={async () => {
				socket.send(JSON.stringify(await GameActionFactory.unreadyUp(data.id)));
			}}>UnReady</button>
		{/if}
		{#if restrictedGameState.tenSecondStartingCountdown}
			Starting in {countdown} seconds...
		{/if}
		<p>Ready: {Object.keys(restrictedGameState.players).filter(player => restrictedGameState.players[player].ready).length}/{Object.keys(restrictedGameState.players)?.length ?? 0}</p>
	{/if}
	<!-- TODO: Remove this line, here for just testing -->
	<p style:white-space="pre-wrap">{JSON.stringify(restrictedGameState, null, 4)}</p>
{:else}
	<p>This Game Doesn't Exist</p>
{/if}