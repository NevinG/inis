export type Card = {
	name: string;
	type: CardType;
	isSeason: boolean;
	isTriskal: boolean;
	seasonMessage: string;
	triskalMessage: string;
	imageSrc?: string;
};

export enum CardType {
	EpicTale,
	Advantage,
	Action
}
