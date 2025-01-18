<script lang="ts">
	import { actionCards, advantageCards, epicTaleCards, type SelectableCard } from '$lib/types/Card';
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';

	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	let autoDraft: boolean = true;
	let lastDraftAmount = 0;

	const draftCards = async () => {
    if(restrictedGameState.cardsToDraft < lastDraftAmount)
      lastDraftAmount = 0
    if (restrictedGameState.isDrafting && restrictedGameState.cardsToDraft > lastDraftAmount) {
      let randomlyDraftedCardIds = [];
      let availableActionCards = (
        restrictedGameState?.players[restrictedGameState.playerId]?.hand.map(
          (cardId) => actionCards[cardId] ?? advantageCards[cardId] ?? epicTaleCards[cardId]
        ) ?? ([] as SelectableCard[])
      ).filter((card) => actionCards[card.id]);
      lastDraftAmount = restrictedGameState.cardsToDraft;
      for (let i = 0; i < restrictedGameState.cardsToDraft; i++) {
        if (availableActionCards.length === 0) break;
        let randomIndex = Math.floor(Math.random() * availableActionCards.length);
        randomlyDraftedCardIds.push(availableActionCards[randomIndex].id);
        availableActionCards.splice(randomIndex, 1);
      }
      socket.send(
        JSON.stringify(await GameActionFactory.draftCards(restrictedGameState.id, randomlyDraftedCardIds))
      );
    }
	};

	$: {
    if (autoDraft && restrictedGameState.hasStarted) {
		  draftCards();
    }
	}
</script>

{#if import.meta.env.VITE_DEV_MODE === 'true'}
<div style="position: absolute; top: 10px; right: 10px;">
	<label>
		<input type="checkbox" bind:checked={autoDraft} />
		Auto Draft
	</label>
</div>
{/if}

