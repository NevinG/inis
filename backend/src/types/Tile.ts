export type Tile = {
  id: number,
  name: string,
  text?: string,
}

export const allTiles : Tile[] = [
  {
    id: 0,
    name: 'Cove',
  },
  {
    id: 1,
    name: 'Forest',
  },
  {
    id: 2,
    name: 'Gates of Tir Na Nog',
    text: 'This territory enters play with 1 Sanctuary. If the turn direction changes, each player present in this territory loses 1 of his clans from this territory and draws 1 Epic Tale card.'
  },
  {
    id: 3,
    name: 'Haven',
  },
  {
    id: 4,
    name: 'Hills',
  },
  {
    id: 5,
    name: 'Iron Mine',
  },
  {
    id: 6,
    name: 'Lost Vale',
  },
  {
    id: 7,
    name: 'Meadows',
  },
  {
    id: 8,
    name: 'Misy Lands',
  },
  {
    id: 9,
    name: 'Moor',
  },
  {
    id: 10,
    name: 'Mountains',
    text: 'When 1 or more clans are moved to this territory, their owner must discard 1 Action card or lose 1 of his clans from this territory.'
  },
  {
    id: 11,
    name: 'Plains',
  },
  {
    id: 12,
    name: 'Salt Mine',
  },
  {
    id: 13,
    name: 'Stone Circle',
    text: 'This territory enters play with 1 Sanctuary.'
  },
  {
    id: 14,
    name: 'Swamp',
    text: 'Citadels cannot be placed in this territory.'
  },
  {
    id: 15,
    name: 'Valley',
  }
]