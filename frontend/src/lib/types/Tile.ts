export type Tile = {
  id: string,
  name: string,
  text?: string,
  color?: string,
}

export type GameTile = {
  tileId: string,
  positions: {x: number, y: number}[], //the three hexagon positions that make up this tile
  clans: Record<string, number>,
  sanctuaries: number,
  citadels: number,
}

export const allTiles : Record<string, Tile> = {
  "0": {
    id: "0",
    name: 'Cove',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "1": {
    id: "1",
    name: 'Forest',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "2": {
    id: "2",
    name: 'Gates of Tir Na Nog',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`,
    text: 'This territory enters play with 1 Sanctuary. If the turn direction changes, each player present in this territory loses 1 of his clans from this territory and draws 1 Epic Tale card.'
  },
  "3": {
    id: "3",
    name: 'Haven',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "4": {
    id: "4",
    name: 'Hills',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "5": {
    id: "5",
    name: 'Iron Mine',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "6": {
    id: "6",
    name: 'Lost Vale',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "7": {
    id: "7",
    name: 'Meadows',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "8": {
    id: "8",
    name: 'Misy Lands',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "9": {
    id: "9",
    name: 'Moor',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "10": {
    id: "10",
    name: 'Mountains',
    text: 'When 1 or more clans are moved to this territory, their owner must discard 1 Action card or lose 1 of his clans from this territory.',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "11": {
    id: "11",
    name: 'Plains',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "12": {
    id: "12",
    name: 'Salt Mine',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "13": {
    id: "13",
    name: 'Stone Circle',
    text: 'This territory enters play with 1 Sanctuary.',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "14": {
    id: "14",
    name: 'Swamp',
    text: 'Citadels cannot be placed in this territory.',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  },
  "15": {
    id: "15",
    name: 'Valley',
    color: `rgb(${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40},${Math.floor(Math.random() * 150) + 40})`
  }
}