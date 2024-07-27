<script lang="ts">
	export let width = 180;
	export let color = "green";
</script>
<style>
	.hex {
		aspect-ratio: cos(30deg);
		clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0);
		position: absolute;
	}
</style>
<div 
  style:width={`${width}px`} 
	style:background={color}
	style:border={`.1px solid ${color}`}
	class="hex" 
	/>
