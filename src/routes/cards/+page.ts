import { type Card, CardType } from '$lib/types/card';

export function load(): { actionCards: Card[], epicTaleCards: Card[], advantageCards: Card[] } {
	return {
		actionCards: [
			{
				name: 'Bard',
				type: CardType.Action,
				isSeason: true,
				isTriskal: true,
				imageSrc: 'https://www.creativefabrica.com/wp-content/uploads/2023/09/08/Bard-Coloring-Page-78761917-1.png',
				seasonMessage: 'Draw 1 Epic Tale card.',
				triskalMessage: 'After your maneuver removes opp. clan(s)\nGain 1 Deed.'
			},
			{
				name: 'Citadel',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Place 1 Citadel in 1 territory with you present; if its Advantage card is not yet played, take it.',
				triskalMessage: ''
			},
			{
				name: 'Conquest',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Choose 1 territory; move any number of your clans from adj. territories into it.',
				triskalMessage: ''
			},
			{
				name: 'Craftsmen & Peasants',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'In each territory with you present, you may place 1 new clan for each Citadel in that territory.',
				triskalMessage: ''
			},
			{
				name: 'Druid',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'If Druid is your last Ac+on card, you cannot play it; look at the discarded Action cards, and take 1.',
				triskalMessage: ''
			},
			{
				name: 'Exploration',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Brenn chooses empty location adj. to 2 territories; place 1 new territory there, place 1 new clan there.',
				triskalMessage: ''
			},
			{
				name: 'Festival',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'In territory with 1 or more Sanctuaries with you present, place 1 of your clans and Festival token; any player initiating clash there removes 1 of his clans; at Season end, remove Festival token.',
				triskalMessage: ''
			},
			{
				name: 'Geis',
				type: CardType.Action,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'Ignore the effect of that Action card, and discard it.'
			},
			{
				name: 'Migration',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Choose 1 territory; move 1 or more of your clans from there to 1 or more adj. territories.',
				triskalMessage: ''
			},
			{
				name: 'New Alliance',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'In territory with you present, place 1 new clan; OR choose opp. with 2+ clans, replace 1 with 1 of yours.',
				triskalMessage: ''
			},
			{
				name: 'New Clans',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Place 2 clans in territories with you present; either together, or in 2 different territories.',
				triskalMessage: ''
			},
			{
				name: 'Sanctuary',
				type: CardType.Action,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Place 1 Sanctuary in a territory with you present; draw 1 Epic Tale card.',
				triskalMessage: ''
			},
			{
				name: 'Warlord',
				type: CardType.Action,
				isSeason: true,
				isTriskal: true,
				seasonMessage: 'Initiate clash in a territory with you present, with you as instigator.',
				triskalMessage: 'Place 1 new clan (exposed) in clashing territory; choose who performs next maneuver.'
			}
		],
		epicTaleCards: [
			{
				name: 'Balor\'s Eye',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Remove 1 clan from any territory.',
				triskalMessage: ''
			}
		],
		advantageCards: [
			{
				name: 'Cove',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After you play a Season card:\nTake the Action card set aside during Assembly phase; then set aside 1 Action card.'
			}
		]
	};
}
