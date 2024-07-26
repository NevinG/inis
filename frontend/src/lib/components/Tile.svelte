<script lang="ts">
	import type { Tile } from '$lib/types/Tile';
	export let tile: Tile;
	let randomColor = Math.floor(Math.random() * 200);
  let height = 180;
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
<div style:height={height + "px"} style:width={`${(height /2 ) / (Math.pow(3,.5) / 2) + Math.pow(3,.5)*(height/4)}px`}>
		<div style:height={height / 2 + "px"} class="hex" style:transform={`translateY(${height/4}px)`}/>
		<div style:height={height / 2 + "px"} style:transform={`translate(${(Math.pow(3,.5)*height/4)}px,0)`} class="hex"/>
		<div style:height={height / 2 + "px"} style:transform={`translate(${(Math.pow(3,.5)*height/4)}px,${height/2}px)`} class="hex"/>
	<!-- <div style:position="relative" style:top="50%">
		<p style:text-align="center">{tile.name}</p>
		<p style:text-align="center">{tile.text}</p>
	</div> -->
</div>
