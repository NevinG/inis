export type Tile = {
  id: number,
  name: string,
  text?: string,
  color?: string,
}

export const allTiles : Tile[] = [
  {
    id: 0,
    name: 'Cove',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 1,
    name: 'Forest',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 2,
    name: 'Gates of Tir Na Nog',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`,
    text: 'This territory enters play with 1 Sanctuary. If the turn direction changes, each player present in this territory loses 1 of his clans from this territory and draws 1 Epic Tale card.'
  },
  {
    id: 3,
    name: 'Haven',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 4,
    name: 'Hills',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 5,
    name: 'Iron Mine',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 6,
    name: 'Lost Vale',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 7,
    name: 'Meadows',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 8,
    name: 'Misy Lands',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 9,
    name: 'Moor',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 10,
    name: 'Mountains',
    text: 'When 1 or more clans are moved to this territory, their owner must discard 1 Action card or lose 1 of his clans from this territory.',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 11,
    name: 'Plains',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 12,
    name: 'Salt Mine',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 13,
    name: 'Stone Circle',
    text: 'This territory enters play with 1 Sanctuary.',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 14,
    name: 'Swamp',
    text: 'Citadels cannot be placed in this territory.',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  {
    id: 15,
    name: 'Valley',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  }
]