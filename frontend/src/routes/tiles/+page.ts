import type { Tile } from '$lib/types/Tile';

export function load(): { tiles: Tile[] } {
	return {
		tiles: [
			{
				name: 'Cove',
			},
			{
				name: 'Forest',
			},
      {
				name: 'Gates of Tir Na Nog',
        text: 'This territory enters play with 1 Sanctuary. If the turn direction changes, each player present in this territory loses 1 of his clans from this territory and draws 1 Epic Tale card.'
			},
      {
				name: 'Haven',
			},
      {
				name: 'Hills',
			},
      {
				name: 'Iron Mine',
			},
      {
				name: 'Lost Vale',
			},
      {
				name: 'Meadows',
			},
      {
				name: 'Misy Lands',
			},
      {
				name: 'Moor',
			},
      {
				name: 'Mountains',
        text: 'When 1 or more clans are moved to this territory, their owner must discard 1 Action card or lose 1 of his clans from this territory.'
			},
      {
				name: 'Plains',
			},
      {
				name: 'Salt Mine',
			},
      {
				name: 'Stone Circle',
        text: 'This territory enters play with 1 Sanctuary.'
			},
      {
				name: 'Swamp',
        text: 'Citadels cannot be placed in this territory.'
			},
      {
				name: 'Valley',
			}
		]
	};
}
