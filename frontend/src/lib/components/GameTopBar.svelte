<script lang="ts">
	import type { RestrictedGameState } from '$lib/types/GameState';
	import GameInfo from './GameInfo.svelte';

	export let restrictedGameState: RestrictedGameState;
</script>

<GameInfo {restrictedGameState}></GameInfo>
