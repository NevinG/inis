<script lang="ts">
	import { GamePrivacy } from '$lib/types/GameState';
	import { api } from '$lib/util/api';
	let maxPlayers: number = 2;
	let privacy: GamePrivacy = GamePrivacy.Private;

	async function createGame() {
		const { id } = await api.createGame({ maxPlayers: maxPlayers, privacy: privacy });
		window.location.href = `/game/${id}`;
	}
</script>

<a href="/">back</a>
<input
	id="private-game"
	type="radio"
	name="visibility"
	value={GamePrivacy.Private}
	bind:group={privacy}
/>
<label for="private-game">Private</label>
<input
	id="public-game"
	type="radio"
	name="visibility"
	value={GamePrivacy.Public}
	bind:group={privacy}
/>
<label for="public-game">Public</label>
<br />

<label for="game-size">Max Players: </label>
<select id="game-size" bind:value={maxPlayers}>
	<option value={2}>2</option>
	<option value={3}>3</option>
	<option value={4}>4</option>
</select>
<br />

<button on:click={createGame}>Create Game</button>
