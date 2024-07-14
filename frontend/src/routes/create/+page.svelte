<script lang="ts">
  function createGame() { 
    
  }
</script>

<input id="private-game" type="radio" name="visibility" value="private" checked/>
<label for="private-game">Private</label>
<input id="public-game" type="radio" name="visibility" value="public"/>
<label for="public-game">Public</label>
<br>

<label for="game-size">Players: </label>
<select id="game-size">
  <option value=2>2</option>
  <option value=3>3</option>
  <option value=4>4</option>
</select>
<br>

<button>Create Game</button>
