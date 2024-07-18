import { type Card, CardType } from '$lib/types/Card';

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
			},
			{
				name: 'Battle Frenzy',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'During clash, at end of Citadels step:\nTake all clans out of Citadels into that territory, they are now exposed clans.'
			},
			{
				name: 'The Battle of Moytura',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'During clash, as a maneuver:\nMove 1 or more of your clans from 1 or more adj. territories to there, place 1 new clan (exposed) there.'
			},
			{
				name: 'Breas\' Tyranny',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'move 1 opp. clan from 1 territory with you present to adj. territory; this does not initiate clash.',
				triskalMessage: ''
			},
			{
				name: 'CathBad\'s Word',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'At start of Assembly phase:\nChoose Action card to set aside; at end of Assembly phase, take it; then set aside 1 Action card.'
			},
			{
				name: 'The Champion\'s Share',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Take the Action card set aside during Assembly phase.',
				triskalMessage: ''
			},
			{
				name: 'Children of Dana',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Place 1 new clan in any territory.',
				triskalMessage: ''
			},
			{
				name: 'The Dagda',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'When Epic Tale card or Advantage card is played:\nIgnore the effect of that card, and discard it; shuffle that card\'s deck & discard pile to create a new deck.'
			},
			{
				name: 'Dagda\'s Cauldron',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'During clash, when 1 of your clans is removed:\nPlay this card face up in front of you; place there all your clans removed during this clash (incl. the one just removed); at end of clash, return max. 3 of your saved clans to territory; discard  this card.'
			},
			{
				name: 'The Dagda\'s Club',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: 'When 1 of your clans is removed:\nThat clan is not removed.',
				triskalMessage: 'When you perform Attack maneuver:\nYou choose whether attacked player removes 1 clan or discards 1 Action card.'
			},
			{
				name: 'Dagda\'s Harp',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'For each other Epic Tale card in your hand, place 1 clan in territory with you present (max. 3 clans)',
				triskalMessage: ''
			},
			{
				name: 'Deirdre\'s Beauty',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Each opponent must reveal 1 random Epic Tale card; take 1 of these, discard the others; remove 1 of your clans from any territory.',
				triskalMessage: ''
			},
			{
				name: 'Diarmuid and Grainne',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'When 1 of your clans is removed:\nPlace that removed clan in a different territory with you present; this does not initiate clash.'
			},
			{
				name: 'Eriu',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'In each territory with 1 or more sanctuaries with you present, you may place 1 new clan (max. 3 clans).',
				triskalMessage: ''
			},
			{
				name: 'The Fianna',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'During clash, as a maneuver:\nMove 1 or more of your clans (exposed or protected) from there to 1 adj. territory; does not initiate clash.'
			},
			{
				name: 'Kernuno\'s Sanctuary',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'In territory without Sanctuaries with you present, place 1 new clan and 1 Sanctuary.',
				triskalMessage: ''
			},
			{
				name: 'Lug Samildanach',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After Action card has been resolved:\nAdd that Ac$on card to your hand.'
			},
			{
				name: 'Lug\'s Spear',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'At start of clash:\nTriskel cards cannot be played by anyone during this clash.'
			},
			{
				name: 'Maeve\'s Wealth',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Each player who can gives you 1 Ac$on card; give 1 Action card to each player who gave you 1.',
				triskalMessage: ''
			},
			{
				name: 'Manannan\'s Horses',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Move max. 3 of your clans from 1 territory to 1 other territory, anywhere.',
				triskalMessage: ''
			},
			{
				name: 'The Morrigan',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'You may flip the Crows token; you may initiate clash in any territory, choosing the instigator.',
				triskalMessage: ''
			},
			{
				name: 'Nuada Silverhand',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'In each territory where you are chieftain, you may place 1 new clan for each opponent present.',
				triskalMessage: ''
			},
			{
				name: 'Oengus\'s Ploy',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'At end of any player\'s turn:\nYou take the next turn; if Season phase would have ended, it continues instead.'
			},
			{
				name: 'Ogma\'s Eloquence',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'During clash, as a maneuver:\nClash ends immediately.'
			},
			{
				name: 'The Other World',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'In territory with you present, for each Sanctuary there place 1 new clan or remove 1 opp. clan (max. 3 such).',
				triskalMessage: ''
			},
			{
				name: 'The Stone of Fal',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Place 2 new clans in Capital\'s territory.',
				triskalMessage: ''
			},
			{
				name: 'Streng\'s Resolve',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After your Attack maneuver:\nGain 1 Deed'
			},
			{
				name: 'Tailtu\'s Land ',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Draw 3 territories, place 1 in empty loca=on adj. to 2 territories; place others at boBom of the pile; then you may move 1 of your clans from adj. territory to there.',
				triskalMessage: ''
			},
			{
				name: 'Tale of Cuchulain',
				type: CardType.EpicTale,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'During clash, as maneuver, with only 1 exposed clan:\nRemove any 2 exposed clans from this territory.'
			},
			{
				name: 'Tuan\'s Memory',
				type: CardType.EpicTale,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'D 	raw 3 Epic Tale cards, take 1, discard others',
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
			},
			{
				name: 'Forest',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After you play an Epic Tale card:\nDraw 1 Epic Tale card.'
			},
			{
				name: 'Gates of Tír Na Nóg',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'When resolving Gates of TNN territory effect:\nDraw 1 more Epic Tale card, choose 1, discard the rest.'
			},
			{
				name: 'Highlands',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'At start of clash in the Highlands:\nChoose 1 player with 1 or more exposed clans; this player becomes clash instigator.'
			},
			{
				name: 'Hills',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'When Attack maneuver against you in Hills:\nignore the AFack; do not remove 1 of your clans, do not discard 1 Action card.'
			},
			{
				name: 'Iron Mine',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'When you perform Attack maneuver:\nAttacked player must BOTH remove 1 exposed clan AND discard 1 Action card.'
			},
			{
				name: 'Lost Vale',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After you play a Season card:\nmove any 1 clan from territory adj. to Lost Vale into it; this does not initiate clash'
			},
			{
				name: 'Meadows',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'When you draw an Epic Tale card:\nDraw 1 more Epic Tale card, choose 1, discard the rest.'
			},
			{
				name: 'Misty Lands',
				type: CardType.Advantage,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Discard 1 or more Action cards, draw that number of Epic Tale cards; choose 1, discard the rest.',
				triskalMessage: ''
			},
			{
				name: 'Moor',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'Look at the Epic Tale cards in 1 opponent\'s hand.'
			},
			{
				name: 'Mountains',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'When you move 1 or more clans to there:\nIgnore the Mountains territory effect.'
			},
			{
				name: 'Plains',
				type: CardType.Advantage,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'Move 1 or more of your clans to 1 or more adj. territories.',
				triskalMessage: ''
			},
			{
				name: 'Salt Mine',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After you play a Season card:\nRandomly take 1 Action card from 1 opponent; then give that player 1 of your Action cards.'
			},
			{
				name: 'Stone Circle',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After you play an Epic Tale card:\nRemove 1 of your clans from Stone Circle, take back that Epic Tale card.'
			},
			{
				name: 'Swamp',
				type: CardType.Advantage,
				isSeason: true,
				isTriskal: false,
				seasonMessage: 'No effect; but can be played instead of passing.',
				triskalMessage: ''
			},
			{
				name: 'Valley',
				type: CardType.Advantage,
				isSeason: false,
				isTriskal: true,
				seasonMessage: '',
				triskalMessage: 'After you play a Season card:\nPlace 1 new clan in a territory where you are present.'
			}
		]
	};
}
