<script lang="ts">
	import type { Tile } from '$lib/types/tile';
	export let tile: Tile;
	let randomColor = Math.floor(Math.random() * 200);
  let width = 500;
  let height = 500;
</script>
<style>
	.hex {
		float: left;
		margin-left: 7.5px;
		margin-bottom: -65px;
    position: absolute;
	}
	.hex .top {
		width: 0;
		border-bottom: 90px solid #6c6;
		border-left: 130px solid transparent;
		border-right: 130px solid transparent;
	}
	.hex .middle {
		width: 260px;
		height: 150px;
		background: #6c6;
	}
	.hex .bottom {
		width: 0;
		border-top: 90px solid #6c6;
		border-left: 130px solid transparent;
		border-right: 130px solid transparent;
	}
	.tile {
		display: inline-block;
    height: 500px;
    position: relative;
    width: 500px;
    margin: 12.5px;
	}
  .tile-text{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    top:20%;
    transform: translateX(15px);
  }
</style>

<div class="tile">
	<div class="hex" style:left="260px">
		<div class="top"></div>
		<div class="middle"></div>
		<div class="bottom"></div>
	</div>
  <div class="hex" style:left="130px" style:top="220px">
		<div class="top"></div>
		<div class="middle"></div>
		<div class="bottom"></div>
	</div>
  <div class="hex">
		<div class="top"></div>
		<div class="middle"></div>
		<div class="bottom"></div>
	</div>
  <div class="tile-text">
    <h2 style:margin="0px">{tile.name}</h2>
    {#if tile.text}<p style:margin="0px">{tile.text}</p>{/if}
  </div>
</div>
