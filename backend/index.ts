import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { CreateGame } from "./types/CreateGame";
import { GameState } from "./types/GameState";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

//TODO move this memory information to its own location outside of this file
const currentGames : {[gameId : string] : GameState} = {};

app.post("/api/create/", (request: Request, response: Response<GameState>) => { 
  //create a new game
  const newGame = new GameState(request.body.privacy);
  //add newGame to memory
  currentGames[newGame.id] = newGame;
  //send response
  response.send(newGame);
});

app.get("/api/game/:id", (request: Request<{id: string}>, response: Response<GameState>) => {
  response.send(currentGames[request.params.id]);
});

const PORT = process.env.PORT;
app.listen(PORT, () => { 
  console.log(`Server running at http://localhost:${PORT}`); 
});