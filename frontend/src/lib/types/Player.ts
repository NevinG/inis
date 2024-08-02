export type RestrictedPlayer = {
	id: string;
	name: string;
	ready: boolean;
	epicTaleCards: number;
	actionCards: number;
	advantageCards: number;
	hand: string[];
	reserveClans: number;
	color: string;
	hasPretenderToken: boolean;
};
