<script lang="ts">
	import { GameActionFactory } from '$lib/types/GameActions';
	import type { RestrictedGameState } from '$lib/types/GameState';
	import { allTiles } from '$lib/types/Tile';
	import Hex from './Hex.svelte';

	export let restrictedGameState: RestrictedGameState;
	export let socket: WebSocket;
	export let gameId: string;

	const tileWidth = 90;
	const tileHeight = (tileWidth * Math.sqrt(3)) / 1.5;

	let tileMapOffset = { x: 0, y: 0 }; //used for dragging around the gameboard

	async function selectTile(tileId: string) {
		if (
			restrictedGameState.brenPickingCapital &&
			restrictedGameState.bren == restrictedGameState.playerId
		) {
			socket.send(JSON.stringify(await GameActionFactory.pickCapitalTerritory(gameId, tileId)));
		} else if (
			restrictedGameState.placeInitialClans &&
			restrictedGameState.placeClanTurn == restrictedGameState.playerId
		) {
			socket.send(JSON.stringify(await GameActionFactory.placeInitialClan(gameId, tileId)));
		}
	}
</script>

<!--TODO: make height not just 350px, but dynamic and cool-->
<div style:width={'100%'} style:height={'100%'} style:overflow="clip">
	{#if restrictedGameState.brenPickingCapital && restrictedGameState.bren == restrictedGameState.playerId}
		<p>Click on territory you want to be capital</p>
	{/if}
	{#if restrictedGameState.placeInitialClans && restrictedGameState.placeClanTurn == restrictedGameState.playerId}
		<p>Choose territory to place a clan in</p>
	{/if}
	<!--This div is draggable-->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:mousemove={(e) => {
			if (e.buttons !== 1) return;
			tileMapOffset.x += e.movementX;
			tileMapOffset.y += e.movementY;
		}}
		style:cursor="move"
		style:transform={`translate(${tileMapOffset.x}px, ${tileMapOffset.y}px)`}
	>
		{#each restrictedGameState.tiles as tile}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={async () => await selectTile(tile.tileId)}>
				{#each tile.positions as { x, y }}
					<div
						style:position="absolute"
						style:left={`calc(50% + ${(x * tileWidth) / 2 - (y * tileWidth) / 2}px)`}
						style:top={`${250 - ((x * tileHeight) / 1.5 + (y * tileHeight) / 1.5)}px`}
					>
						<Hex width={tileWidth} color={allTiles[tile.tileId].color} />
					</div>
				{/each}
				<!-- positioned by taking the average x position of the three tiles and average y pos of the three tiles -->
				<div
					style:width={`${tileWidth}px`}
					style:height={`${tileHeight}px`}
					style:position="absolute"
					style:left={`calc(50% + ${((tile.positions.reduce((x, cur) => x + cur.x, 0) / 3) * tileWidth) / 2 - ((tile.positions.reduce((y, cur) => y + cur.y, 0) / 3) * tileWidth) / 2}px)`}
					style:top={`${250 - (((tile.positions.reduce((x, cur) => x + cur.x, 0) / 3) * tileHeight) / 1.5 + ((tile.positions.reduce((y, cur) => y + cur.y, 0) / 3) * tileHeight) / 1.5)}px`}
				>
					<!-- Territory data -->
					<p style:margin="2px 0" style:text-align="center">{allTiles[tile.tileId].name}</p>
					{#if tile.tileId == restrictedGameState.capitalTerritory}
						<p style:font-weight="bold" style:text-align="center" style:margin="2px 0">Capital</p>
					{/if}
					<!--Clans -->
					<div>
						{#each Object.entries(tile.clans) as [playerId, numberOfClans]}
							{#each { length: numberOfClans } as _}
								<div
									style:border="1px solid black"
									style:width="15px"
									style:height="15px"
									style:margin="2px"
									style:background-color={restrictedGameState.players[playerId].color}
									style:display="inline-block"
								/>
							{/each}
						{/each}
					</div>
					<!-- Santuaries & citadels -->
					<div>
						{#each { length: tile.citadels } as _}
							<div
								style:border="1px solid black"
								style:width="20px"
								style:height="20px"
								style:margin="2px"
								style:background-color="grey"
								style:display="inline-block"
							/>
						{/each}
						{#each { length: tile.sanctuaries } as _}
							<div
								style:border="1px solid black"
								style:width="20px"
								style:height="20px"
								style:margin="2px"
								style:background-color="brown"
								style:display="inline-block"
							/>
						{/each}
					</div>
					{#if allTiles[tile.tileId].text}
						<!-- svelte-ignore a11y-mouse-events-have-key-events -->
						<div
							style:margin="auto"
							style:width="15px"
							style:aspect-ratio="1/1"
							style:border="1px solid black"
							on:mouseover={(e) => {
								e.currentTarget.children[1].style.visibility = 'visible';
							}}
							on:mouseout={(e) => {
								e.currentTarget.children[1].style.visibility = 'hidden';
							}}
						>
							<span style:margin="auto" style:display="block" style:width="max-content">?</span>
							<div
								style:position="absolute"
								style:padding="5px"
								style:border-radius="5px"
								style:z-index="2"
								style:max-width={`${tileWidth * 4}px`}
								style:width="max-content"
								style:visibility="hidden"
								style:border="1px solid black"
								style:background-color={allTiles[tile.tileId].color}
							>
								<p>{allTiles[tile.tileId].text}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
