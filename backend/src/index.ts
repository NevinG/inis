import express, { Request, Response } from "express";
import dotenv from "dotenv";
import GameManager from "./util/GameManager";
import { GamePreview, GamePrivacy, GameState } from "./types/GameState";
import { CreateGame } from "./types/CreateGame";
import { WebSocketServer } from 'ws';
import cors from "cors";
import bodyParser from "body-parser";
import jwt, { JwtPayload } from "jsonwebtoken"
import { SocketManager } from "./util/SocketManager";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/create", (request: Request<{},{}, CreateGame>, response: Response<{id: string}>) => { 
  const gameId = GameManager.createGame(request.body.privacy, request.body.maxPlayers);
  response.send({id: gameId});
});

app.get("/api/game", (request: Request, response: Response<GamePreview[]>) => {
  response.send(GameManager.getGames());
});

app.get("/api/auth", (request: Request, response: Response<{jwt: string}>) => {
  const token = request.query.token as string;
  if(!token) {
    response.send({jwt: jwt.sign({id: crypto.randomUUID()}, process.env.TOKEN_SECRET!, { expiresIn: '24hr' }) as string});
  }else{
    const jwtData  = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
    response.send({jwt: jwt.sign({id: jwtData.id}, process.env.TOKEN_SECRET!, { expiresIn: '24hr' }) as string});
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => { 
  console.log(`Server running at http://localhost:${PORT}`); 
});

//new ws version
const wss = new WebSocketServer({ port: 8080 });
console.log('websocket server listening on ws://localhost:8080');
wss.on('connection', function connection(ws : WebSocket & {id: string, on: any}) {
  ws.id = crypto.randomUUID();
  SocketManager.AddSocket(ws);
  ws.on('message', function message(data : string) {
    SocketManager.HandleMessage(ws.id, data);
  });
});
