<script lang="ts">
	import GameLobby from '$lib/components/GameLobby.svelte';
	import Game from '$lib/components/Game.svelte';
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
</script>

{#if restrictedGameState !== undefined && restrictedGameState !== null}
	{#if restrictedGameState.hasStarted}
		<Game {restrictedGameState} gameId={data.id} {socket} />
	{:else}
		<GameLobby {restrictedGameState} gameId={data.id} {socket} />
	{/if}
{:else}
	<p>This Game Doesn't Exist</p>
{/if}
