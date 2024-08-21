<script lang="ts">
	import type { RestrictedGameState } from '$lib/types/GameState';
	import { allTiles, type GameTile } from '$lib/types/Tile';
	import Hex from './Hex.svelte';

	export let restrictedGameState: RestrictedGameState;
	$: gameTiles = restrictedGameState.tiles as (GameTile & { selected: boolean })[];

	const tileWidth = 90;
	const tileHeight = (tileWidth * Math.sqrt(3)) / 1.5;

	let tileMapOffset = { x: 0, y: 0 }; //used for dragging around the gameboard

	export let selectTile: (tileId: string) => Promise<void> = async (_) => {};
	export let clanMoves: { from: string; to: string; numClans: number }[] = []; //for display what a move would look like before it happens
	export let addedClans: { territory: string; numClans: number; playerId?: string }[] = [];

	export let displayPossibleNewTiles: boolean = false;
	export let newTileParts: { x: number; y: number }[] = []; //the already placed possible new tiles

	let possibleNewTiles: { x: number; y: number }[] = [];
	$: if (displayPossibleNewTiles) {
		possibleNewTiles = [];
		const positions: Record<string, string> = {};
		gameTiles.forEach((tile) => {
			tile.positions.forEach((pos) => {
				positions[`${pos.x},${pos.y}`] = tile.tileId;
			});
		});

		//for each tile, get all adjacentTiles that don't exist
		const newTileOptions =
			newTileParts.length == 0
				? gameTiles.map((tile) => tile.positions).flat()
				: newTileParts.length < 3
					? newTileParts
					: [];
		newTileOptions.forEach((pos) => {
			//check if adjacent tiles exist
			const adjacentTiles = [
				{ x: pos.x + 1, y: pos.y },
				{ x: pos.x - 1, y: pos.y },
				{ x: pos.x, y: pos.y + 1 },
				{ x: pos.x, y: pos.y - 1 },
				{ x: pos.x + 1, y: pos.y - 1 },
				{ x: pos.x - 1, y: pos.y + 1 }
			];
			adjacentTiles.forEach((adjTile) => {
				if (!(adjTile.x + ',' + adjTile.y in positions)) {
					possibleNewTiles.push(adjTile);
				}
			});
		});

		//for each possible new tiles remove tiles that aren't adjacent two two or more unique tiles
		if (newTileParts.length == 0) {
			possibleNewTiles = possibleNewTiles.filter((pos) => {
				const adjacentTiles = [
					{ x: pos.x + 1, y: pos.y },
					{ x: pos.x - 1, y: pos.y },
					{ x: pos.x, y: pos.y + 1 },
					{ x: pos.x, y: pos.y - 1 },
					{ x: pos.x + 1, y: pos.y - 1 },
					{ x: pos.x - 1, y: pos.y + 1 }
				];
				let adjacent = new Set<string>();
				adjacentTiles.forEach((adjTile) => {
					if (adjTile.x + ',' + adjTile.y in positions) {
						adjacent.add(positions[adjTile.x + ',' + adjTile.y]);
					}
				});
				return adjacent.size >= 2;
			});
		} else if (newTileParts.length == 2) {
			possibleNewTiles = possibleNewTiles.filter((pos) => {
				const adjacentTiles = [
					{ x: pos.x + 1, y: pos.y },
					{ x: pos.x - 1, y: pos.y },
					{ x: pos.x, y: pos.y + 1 },
					{ x: pos.x, y: pos.y - 1 },
					{ x: pos.x + 1, y: pos.y - 1 },
					{ x: pos.x - 1, y: pos.y + 1 }
				];
				let adjacentCount = 0;
				adjacentTiles.forEach((adjTile) => {
					if (newTileParts.find((part) => part.x == adjTile.x && part.y == adjTile.y)) {
						adjacentCount++;
					}
				});
				return adjacentCount >= 2;
			});
		}

		possibleNewTiles = possibleNewTiles;
	}

	$: tempGameTile = gameTiles.map((tile) => {
		let newTile = { ...tile };
		newTile.clans = { ...tile.clans };
		clanMoves.forEach((move) => {
			if (!(restrictedGameState.playerId in newTile.clans)) {
				newTile.clans[restrictedGameState.playerId] = 0;
			}

			if (move.from == tile.tileId) {
				newTile.clans[restrictedGameState.playerId] -= move.numClans;
			}
			if (move.to == tile.tileId) {
				newTile.clans[restrictedGameState.playerId] += move.numClans;
			}
		});
		addedClans.forEach((clan) => {
			if (!(restrictedGameState.playerId in newTile.clans)) {
				newTile.clans[clan.playerId ?? restrictedGameState.playerId] = 0;
			}

			if (clan.territory == tile.tileId) {
				newTile.clans[clan.playerId ?? restrictedGameState.playerId] += clan.numClans;
			}
		});
		return newTile as GameTile & { selected: boolean };
	});
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
		{#each tempGameTile as tile}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={async () => await selectTile(tile.tileId)}
				style:opacity={tile.selected ? 0.5 : 1}
			>
				{#each tile.positions as { x, y }}
					<div
						style:position="absolute"
						style:left={`calc(50% + ${(x * tileWidth) / 2 - (y * tileWidth) / 2}px)`}
						style:top={`${250 - ((x * tileHeight) / 1.34 + (y * tileHeight) / 1.34)}px`}
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
					style:z-index="2"
				>
					<!-- Territory data -->
					<p style:margin="2px 0" style:text-align="center">{allTiles[tile.tileId].name}</p>
					{#if tile.tileId == restrictedGameState.capitalTerritory}
						<p style:font-weight="bold" style:text-align="center" style:margin="2px 0">Capital</p>
					{/if}
					{#if tile.festival}
						<p style:font-weight="bold" style:text-align="center" style:margin="2px 0">Festival</p>
					{/if}
					{#if restrictedGameState.clashes.territories.includes(tile.tileId)}
						{#if restrictedGameState.clashes.currentlyResolvingTerritory == tile.tileId}
							<p style:text-align="center" style:margin="2px 0">Clash(now)</p>
						{:else}
							<p style:text-align="center" style:margin="2px 0">Clash(later)</p>
						{/if}
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
						<slot {tile} />
					</div>
					{#if allTiles[tile.tileId].text}
						<!-- svelte-ignore a11y-mouse-events-have-key-events -->
						<div
							style:margin="auto"
							style:width="15px"
							style:aspect-ratio="1/1"
							style:border="1px solid black"
							on:mouseover={(e) => {
								//@ts-expect-error style is a property of HTMLElement
								e.currentTarget.children[1].style.visibility = 'visible';
							}}
							on:mouseout={(e) => {
								//@ts-expect-error style is a property of HTMLElement
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
		{#each possibleNewTiles as { x, y }}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				style:position="absolute"
				style:left={`calc(50% + ${(x * tileWidth) / 2 - (y * tileWidth) / 2}px)`}
				style:top={`${250 - ((x * tileHeight) / 1.34 + (y * tileHeight) / 1.34)}px`}
				style:opacity="0.2"
				style:cursor="pointer"
				on:click={() => {
					newTileParts.push({ x, y });
					newTileParts = newTileParts;
				}}
			>
				<Hex width={tileWidth} color="green" />
			</div>
		{/each}
		{#each newTileParts as { x, y }}
			<div
				style:position="absolute"
				style:left={`calc(50% + ${(x * tileWidth) / 2 - (y * tileWidth) / 2}px)`}
				style:top={`${250 - ((x * tileHeight) / 1.34 + (y * tileHeight) / 1.34)}px`}
				style:opacity="0.5"
			>
				<Hex width={tileWidth} color="green" />
			</div>
		{/each}
	</div>
</div>
