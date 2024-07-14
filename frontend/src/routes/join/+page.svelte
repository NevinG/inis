<script lang="ts">
  let gameCode : string = "";

  function clickJoin() {
    window.location.href = `/join/${gameCode}`;
  }
</script>

<label for="game-code">Game Code:</label>
<input id="game-code" type="text" placeholder="Enter Game Code" bind:value={gameCode}/>
<button on:click={clickJoin}>Join Game</button>