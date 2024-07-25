import { actionCards, advantageCards, type Card, epicTaleCards } from '$lib/types/Card';

export function load(): { actionCards: Card[], epicTaleCards: Card[], advantageCards: Card[] } {
	return {
		actionCards: actionCards,
		epicTaleCards: epicTaleCards,
		advantageCards: advantageCards
	}
}