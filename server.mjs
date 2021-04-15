import http from "http";
import express from "express";
import socketio from "socket.io";
import path from "path";
import {Game, Player, Card, Deck} from "./game.mjs"

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let games = [new Game("game0")];

const PORT = process.env.PORT || 8080;

//when socket connects
io.on("connection", socket => {
  console.log("socket connected");
	let joinedGame = false;
	games.forEach((game, i) => {
		if (game.players.length < Game.numOfPlayers) {
			let player = new Player(socket);
			player.socket.join(game.room);
			game.players.push(player);
			io.to(game.room).emit("playerjoined", game.players.length);
			joinedGame = true;
			if (game.players.length == Game.numOfPlayers) {
				console.log("game is starting");
				game.start();
			}
			return;
		}
	});
	if(!joinedGame){
		let game = new Game("game" + games.length);
		game.players.push(new Player(socket));
	}
});

//set static folder
app.use(express.static("public"));

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

export {io};
