<script lang="ts">
	import type { RestrictedGameState } from "$lib/types/GameState";
	import GameInfo from "./GameInfo.svelte";
	import PlayerCards from "./PlayerCards.svelte";

  export let restrictedGameState : RestrictedGameState;
  export let socket : WebSocket;
  export let gameId : string;
</script>

<div style:height="100%" style:width="100%">
  <PlayerCards {restrictedGameState} {socket} {gameId}></PlayerCards>
</div>