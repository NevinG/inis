export type Card = {
	name: string;
	id: string;
	type: CardType;
	isSeason: boolean;
	isTriskal: boolean;
	seasonMessage: string;
	triskalMessage: string;
	imageSrc?: string;
};

export type SelectableCard = Card & { selected?: boolean; hovering?: boolean };

export enum CardType {
	EpicTale,
	Advantage,
	Action
}

export const actionCards: Record<string, Card> = {
	'1': {
		name: 'Bard',
		id: '1',
		type: CardType.Action,
		isSeason: true,
		isTriskal: true,
		imageSrc:
			'https://www.creativefabrica.com/wp-content/uploads/2023/09/08/Bard-Coloring-Page-78761917-1.png',
		seasonMessage: 'Draw 1 Epic Tale card.',
		triskalMessage: 'After your maneuver removes opp. clan(s)\nGain 1 Deed.'
	},
	'2': {
		name: 'Citadel',
		id: '2',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Place 1 Citadel in 1 territory with you present; if its Advantage card is not yet played, take it.',
		triskalMessage: ''
	},
	'3': {
		name: 'Conquest',
		id: '3',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Choose 1 territory; move any number of your clans from adj. territories into it.',
		triskalMessage: ''
	},
	'4': {
		name: 'Craftsmen & Peasants',
		id: '4',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'In each territory with you present, you may place 1 new clan for each Citadel in that territory.',
		triskalMessage: ''
	},
	'5': {
		name: 'Druid',
		id: '5',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'If Druid is your last Ac+on card, you cannot play it; look at the discarded Action cards, and take 1.',
		triskalMessage: ''
	},
	'6': {
		name: 'Exploration',
		id: '6',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Brenn chooses empty location adj. to 2 territories; place 1 new territory there, place 1 new clan there.',
		triskalMessage: ''
	},
	'7': {
		name: 'Festival',
		id: '7',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'In territory with 1 or more Sanctuaries with you present, place 1 of your clans and Festival token; any player initiating clash there removes 1 of his clans; at Season end, remove Festival token.',
		triskalMessage: ''
	},
	'8': {
		name: 'Geis',
		id: '8',
		type: CardType.Action,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage: 'Ignore the effect of that Action card, and discard it.'
	},
	'9': {
		name: 'Migration',
		id: '9',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Choose 1 territory; move 1 or more of your clans from there to 1 or more adj. territories.',
		triskalMessage: ''
	},
	'10': {
		name: 'New Alliance',
		id: '10',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'In territory with you present, place 1 new clan; OR choose opp. with 2+ clans, replace 1 with 1 of yours.',
		triskalMessage: ''
	},
	'11': {
		name: 'New Clans',
		id: '11',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Place 2 clans in territories with you present; either together, or in 2 different territories.',
		triskalMessage: ''
	},
	'12': {
		name: 'Sanctuary',
		id: '12',
		type: CardType.Action,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'Place 1 Sanctuary in a territory with you present; draw 1 Epic Tale card.',
		triskalMessage: ''
	},
	'13': {
		name: 'Warlord',
		id: '13',
		type: CardType.Action,
		isSeason: true,
		isTriskal: true,
		seasonMessage: 'Initiate clash in a territory with you present, with you as instigator.',
		triskalMessage:
			'Place 1 new clan (exposed) in clashing territory; choose who performs next maneuver.'
	}
};

export const epicTaleCards: Record<string, Card> = {
	'14': {
		name: "Balor's Eye",
		id: '14',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'Remove 1 clan from any territory.',
		triskalMessage: ''
	},
	'15': {
		name: 'Battle Frenzy',
		id: '15',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'During clash, at end of Citadels step:\nTake all clans out of Citadels into that territory, they are now exposed clans.'
	},
	'16': {
		name: 'The Battle of Moytura',
		id: '16',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'During clash, as a maneuver:\nMove 1 or more of your clans from 1 or more adj. territories to there, place 1 new clan (exposed) there.'
	},
	'17': {
		name: "Breas' Tyranny",
		id: '17',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'move 1 opp. clan from 1 territory with you present to adj. territory; this does not initiate clash.',
		triskalMessage: ''
	},
	'18': {
		name: "CathBad's Word",
		id: '18',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'At start of Assembly phase:\nChoose Action card to set aside; at end of Assembly phase, take it; then set aside 1 Action card.'
	},
	'19': {
		name: "The Champion's Share",
		id: '19',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'Take the Action card set aside during Assembly phase.',
		triskalMessage: ''
	},
	'20': {
		name: 'Children of Dana',
		id: '20',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'Place 1 new clan in any territory.',
		triskalMessage: ''
	},
	'21': {
		name: 'The Dagda',
		id: '21',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			"When Epic Tale card or Advantage card is played:\nIgnore the effect of that card, and discard it; shuffle that card's deck & discard pile to create a new deck."
	},
	'22': {
		name: "Dagda's Cauldron",
		id: '22',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'During clash, when 1 of your clans is removed:\nPlay this card face up in front of you; place there all your clans removed during this clash (incl. the one just removed); at end of clash, return max. 3 of your saved clans to territory; discard  this card.'
	},
	'23': {
		name: "The Dagda's Club",
		id: '23',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: 'When 1 of your clans is removed:\nThat clan is not removed.',
		triskalMessage:
			'When you perform Attack maneuver:\nYou choose whether attacked player removes 1 clan or discards 1 Action card.'
	},
	'24': {
		name: "Dagda's Harp",
		id: '24',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'For each other Epic Tale card in your hand, place 1 clan in territory with you present (max. 3 clans)',
		triskalMessage: ''
	},
	'25': {
		name: "Deirdre's Beauty",
		id: '25',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Each opponent must reveal 1 random Epic Tale card; take 1 of these, discard the others; remove 1 of your clans from any territory.',
		triskalMessage: ''
	},
	'26': {
		name: 'Diarmuid and Grainne',
		id: '26',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'When 1 of your clans is removed:\nPlace that removed clan in a different territory with you present; this does not initiate clash.'
	},
	'27': {
		name: 'Eriu',
		id: '27',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'In each territory with 1 or more sanctuaries with you present, you may place 1 new clan (max. 3 clans).',
		triskalMessage: ''
	},
	'28': {
		name: 'The Fianna',
		id: '28',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'During clash, as a maneuver:\nMove 1 or more of your clans (exposed or protected) from there to 1 adj. territory; does not initiate clash.'
	},
	'29': {
		name: "Kernuno's Sanctuary",
		id: '29',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'In territory without Sanctuaries with you present, place 1 new clan and 1 Sanctuary.',
		triskalMessage: ''
	},
	'30': {
		name: 'Lug Samildanach',
		id: '30',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage: 'After Action card has been resolved:\nAdd that Ac$on card to your hand.'
	},
	'31': {
		name: "Lug's Spear",
		id: '31',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'At start of clash:\nTriskel cards cannot be played by anyone during this clash.'
	},
	'32': {
		name: "Maeve's Wealth",
		id: '32',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Each player who can gives you 1 Ac$on card; give 1 Action card to each player who gave you 1.',
		triskalMessage: ''
	},
	'33': {
		name: "Manannan's Horses",
		id: '33',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'Move max. 3 of your clans from 1 territory to 1 other territory, anywhere.',
		triskalMessage: ''
	},
	'34': {
		name: 'The Morrigan',
		id: '34',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'You may flip the Crows token; you may initiate clash in any territory, choosing the instigator.',
		triskalMessage: ''
	},
	'35': {
		name: 'Nuada Silverhand',
		id: '35',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'In each territory where you are chieftain, you may place 1 new clan for each opponent present.',
		triskalMessage: ''
	},
	'36': {
		name: "Oengus's Ploy",
		id: '36',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			"At end of any player's turn:\nYou take the next turn; if Season phase would have ended, it continues instead."
	},
	'37': {
		name: "Ogma's Eloquence",
		id: '37',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage: 'During clash, as a maneuver:\nClash ends immediately.'
	},
	'38': {
		name: 'The Other World',
		id: '38',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'In territory with you present, for each Sanctuary there place 1 new clan or remove 1 opp. clan (max. 3 such).',
		triskalMessage: ''
	},
	'39': {
		name: 'The Stone of Fal',
		id: '39',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage: "Place 2 new clans in Capital's territory.",
		triskalMessage: ''
	},
	'40': {
		name: "Streng's Resolve",
		id: '40',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage: 'After your Attack maneuver:\nGain 1 Deed'
	},
	'41': {
		name: "Tailtu's Land ",
		id: '41',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Draw 3 territories, place 1 in empty loca=on adj. to 2 territories; place others at boBom of the pile; then you may move 1 of your clans from adj. territory to there.',
		triskalMessage: ''
	},
	'42': {
		name: 'Tale of Cuchulain',
		id: '42',
		type: CardType.EpicTale,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'During clash, as maneuver, with only 1 exposed clan:\nRemove any 2 exposed clans from this territory.'
	},
	'43': {
		name: "Tuan's Memory",
		id: '43',
		type: CardType.EpicTale,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'D 	raw 3 Epic Tale cards, take 1, discard others',
		triskalMessage: ''
	}
};

export const advantageCards: Record<string, Card> = {
	'44': {
		name: 'Cove',
		id: '44',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'After you play a Season card:\nTake the Action card set aside during Assembly phase; then set aside 1 Action card.'
	},
	'45': {
		name: 'Forest',
		id: '45',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage: 'After you play an Epic Tale card:\nDraw 1 Epic Tale card.'
	},
	'46': {
		name: 'Gates of Tír Na Nóg',
		id: '46',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'When resolving Gates of TNN territory effect:\nDraw 1 more Epic Tale card, choose 1, discard the rest.'
	},
	'47': {
		name: 'Highlands',
		id: '47',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'At start of clash in the Highlands:\nChoose 1 player with 1 or more exposed clans; this player becomes clash instigator.'
	},
	'48': {
		name: 'Hills',
		id: '48',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'When Attack maneuver against you in Hills:\nignore the AFack; do not remove 1 of your clans, do not discard 1 Action card.'
	},
	'49': {
		name: 'Iron Mine',
		id: '49',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'When you perform Attack maneuver:\nAttacked player must BOTH remove 1 exposed clan AND discard 1 Action card.'
	},
	'50': {
		name: 'Lost Vale',
		id: '50',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'After you play a Season card:\nmove any 1 clan from territory adj. to Lost Vale into it; this does not initiate clash'
	},
	'51': {
		name: 'Meadows',
		id: '51',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'When you draw an Epic Tale card:\nDraw 1 more Epic Tale card, choose 1, discard the rest.'
	},
	'52': {
		name: 'Misty Lands',
		id: '52',
		type: CardType.Advantage,
		isSeason: true,
		isTriskal: false,
		seasonMessage:
			'Discard 1 or more Action cards, draw that number of Epic Tale cards; choose 1, discard the rest.',
		triskalMessage: ''
	},
	'53': {
		name: 'Moor',
		id: '53',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage: "Look at the Epic Tale cards in 1 opponent's hand."
	},
	'54': {
		name: 'Mountains',
		id: '54',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'When you move 1 or more clans to there:\nIgnore the Mountains territory effect.'
	},
	'55': {
		name: 'Plains',
		id: '55',
		type: CardType.Advantage,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'Move 1 or more of your clans to 1 or more adj. territories.',
		triskalMessage: ''
	},
	'56': {
		name: 'Salt Mine',
		id: '56',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'After you play a Season card:\nRandomly take 1 Action card from 1 opponent; then give that player 1 of your Action cards.'
	},
	'57': {
		name: 'Stone Circle',
		id: '57',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'After you play an Epic Tale card:\nRemove 1 of your clans from Stone Circle, take back that Epic Tale card.'
	},
	'58': {
		name: 'Swamp',
		id: '58',
		type: CardType.Advantage,
		isSeason: true,
		isTriskal: false,
		seasonMessage: 'No effect; but can be played instead of passing.',
		triskalMessage: ''
	},
	'59': {
		name: 'Valley',
		id: '59',
		type: CardType.Advantage,
		isSeason: false,
		isTriskal: true,
		seasonMessage: '',
		triskalMessage:
			'After you play a Season card:\nPlace 1 new clan in a territory where you are present.'
	}
};
