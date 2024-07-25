import type { Card } from "./Card";

export type Player = {
  id: string,
  name: string,
  ready: boolean,
  hand: Card[]
}

export type RestrictedPlayer = {
  id: string;
  name: string;
  ready: boolean;
  epicTaleCards: number;
  actionCards: number;
  advantageCards: number;
  hand: Card[];
}