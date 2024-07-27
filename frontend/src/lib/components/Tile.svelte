<script lang="ts">
	import type { Tile } from '$lib/types/Tile';
	export let tile: Tile;
	let randomColor = Math.floor(Math.random() * 200);
  export let width = 180;

	export let variant: boolean;
</script>
<style>
	.hex {
		aspect-ratio: 1/cos(30deg);
		clip-path: polygon(50% -50%,100% 50%,50% 150%,0 50%);
		background: green;
		position: absolute;
		border: 1px solid green;
	}
</style>

{#if variant}
<div style:rotate={"30deg"} style:height={width + "px"} style:width={`${(width /2 ) / (Math.pow(3,.5) / 2) + Math.pow(3,.5)*(width/4)}px`}>
	<div style:height={width / 2 + "px"} style:transform={`translateY(${width/4}px)`} class="hex"/>
	<div style:height={width / 2 + "px"} style:transform={`translate(${(Math.pow(3,.5)*width/4)}px,0)`} class="hex"/>
	<div style:height={width / 2 + "px"} style:transform={`translate(${(Math.pow(3,.5)*width/4)}px,${width/2}px)`} class="hex"/>
<div style:position="relative" style:top={"25%"} style:transform={"translateY(0)"}>
	<p style:margin-top=0 style:text-align="center">{tile.name}</p>
	<p style:text-align="center">{tile.text ?? ""}</p>
</div>
</div>
{:else}
<div style:rotate={"-30deg"} style:height={width + "px"} style:width={`${(width /2 ) / (Math.pow(3,.5) / 2) + Math.pow(3,.5)*(width/4)}px`}>
	<div style:height={width / 2 + "px"} style:transform={`translateY(${width/4}px)`} class="hex"/>
	<div style:height={width / 2 + "px"} style:transform={`translate(${(Math.pow(3,.5)*width/4)}px,0)`} class="hex"/>
	<div style:height={width / 2 + "px"} style:transform={`translate(${(Math.pow(3,.5)*width/4)}px,${width/2}px)`} class="hex"/>
<div style:position="relative" style:top={"25%"} style:transform={"translateY(0)"}>
	<p style:margin-top=0 style:text-align="center">{tile.name}</p>
	<p style:text-align="center">{tile.text ?? ""}</p>
</div>
</div>
{/if}
