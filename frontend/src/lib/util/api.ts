import type { CreateGame } from '$lib/types/CreateGame';
import { type GamePreview } from '$lib/types/GameState';

export const api = {
	createGame: async (createGame: CreateGame): Promise<{ id: string }> => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create`, {
			method: 'POST',
			body: JSON.stringify(createGame),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	},
	getPublicGames: async (): Promise<{ games: GamePreview[] }> => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/game`);
		const games: GamePreview[] = await response.json();
		return { games: games };
	},
	getAuth: async (): Promise<string> => {
		const curJwt = localStorage.getItem('jwt');
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/auth?${curJwt ? `token=${curJwt}` : ''}`
		);
		const { jwt } = await response.json();
		localStorage.setItem('jwt', jwt);
		return jwt;
	}
};
