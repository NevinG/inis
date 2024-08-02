import { actionCards, advantageCards, type Card, epicTaleCards } from '$lib/types/Card';

export function load(): { actionCards: Card[]; epicTaleCards: Card[]; advantageCards: Card[] } {
	return {
		actionCards: Object.values(actionCards),
		epicTaleCards: Object.values(epicTaleCards),
		advantageCards: Object.values(advantageCards)
	};
}
