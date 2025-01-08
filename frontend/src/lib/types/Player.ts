export type RestrictedPlayer = {
  id: string;
  name: string;
  ready: boolean;
  epicTaleCards: number;
  actionCards: number;
  advantageCards: number;
  hand: string[];
  triskalsAvailable: string[];
  reserveClans: number;
  deedCount: number;
  color: string;
  hasPretenderToken: boolean;
};