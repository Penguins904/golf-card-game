const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
require("game.js")();

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {Game, Card, Deck, Player} = require("game.js");
let games = [new Game("game0")];

const PORT = process.env.PORT || 8080;

//when socket connects
io.on("connection", socket => {
  console.log("socket connected");
	let joinedGame = false;
	for(game in games){
		if (game.players.length != Game.numOfPlayers) {
			player = new Player(socket);
			player.socket.join(game.room);
			game.players.push(player);
			socket.to(game.room).emit("playerjoined", game.players.length);
			joinedGame = true;
			break;
		}
	}
	if(!joinedGame){
		let game = new Game("game" + games.length));
		game.players.push(new Player(socket));
	}
});

//set static folder
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
