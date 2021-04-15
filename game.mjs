import {io} from "./server.mjs";

class Game {
  static numOfPlayers = 4;

  constructor(room, io) {
    this.players = [];
		this.deck = new Deck();
		this.room = room;
  }

	start() {
		this.deck.shuffle()
		console.log("game started");
		io.to(this.room).emit("start");
		this.players.forEach((player, i) => {
			player.index = i;
			let cards = this.deck.cardList.splice(0, 4);
			player.giveCards(cards);
		});
		this.deck.cardList.unshift(null);
		for(let i = 0; i < this.numOfPlayers * 4; i++) {
			this.turn(this.players[i])
		}

	}

	turn(player) {
		console.log("turn started");
		player.socket.emit("your turn");
		player.socket.to(this.room).emit("playerTurn", player.index)
		while(true) {
			let hasDrawn = false;
			player.socket.once("action", (data) => {
				switch (data.action) {
					case "draw":
						if(hasDrawn) {
							player.socket.emit("alreadyDrawn");
							break;
						}
						hasDrawn = true;
						this.deck.cardList.shift();
						io.to(this.room).emit("newTopCard", this.deck.cardList[0].toHTML());
						return;
					case "swap":
						let deckCard = this.deck.cardList[0];
						if(player.cards[data.index].isFlipped){
							player.socket.emit("cardAlreadyFlipped");
							break;
						}
						this.deck.cardList[0] = player.cards[data.index];
						player.cards[data.index] = deckCard;
						io.to(this.room).emit("newTopCard", this.deck.cardList[0].toHTML());
						io.to(this.room).emit("flippedCard", {card: data.index, player: player.index});
						return;
					case "flip":
						if(player.cards[data.index]) {
							player.socket.emit("cardAlreadyFlipped");
						}
						player.cards[data.index].isFlipped = true;
						io.to(this.room).emit("flippedCard", {player: player.index, card: player.cards[data.index]});
						return;
				}
			});
		}
	}
}

class Card {
  /*
	name: 2, 3, 4...J, Q, K, A
  suit: diamonds, hearts, clubs, spades
  color: red, black
  Face Card: J, Q, K, A
  value: 2 = 2, 3 = 3, ..., J = 10, Q = 10, K = 0, A = 1
  isFlipped: True, False
	*/
  static suitsList = ["spades", "hearts", "diamonds", "clubs"]
  static namesList = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

  constructor(name, suit) {
    this.name = name;
    this.suit = suit;

    if (name == "clubs" || name == "spades") {
      this.color = "black";
    } else {
      this.color = "red";
    }

    this.value = parseInt(name);
    this.isFaceCard = true;
    if(this.value !== this.value) { //checks if this.value is NaN
      this.isFaceCard = false; //A is a face card
      switch (name) {
        case "J" || "Q":
          this.value = 10;
          break;
        case "K":
          this.value = 0;
          break;
        case "A":
          this.value = 1;
          break;
      }
    }
    this.isFlipped = false;
  }

  toHTML() {
     var code = 0;
		 function getcode(num, card) {
		 	return num + Card.namesList.indexOf(card.name) + (Card.namesList.indexOf(card.name) > Card.namesList.indexOf("J"));
		 }
     switch (this.suit) {
		 	case "spades":
				code = getcode(127137, this);
				break;
			case "hearts":
				code = getcode(127153, this);
				break;
			case "diamonds":
				code = getcode(127153, this);
				break;
			case "clubs":
				code = getcode(127185, this);
				break;
     }
		 return "&#" + code + ";";
  }

	fromHTML(code) {
		if(code < 127153) {
			code -= 127137;
			if(code > 127148){
				code--;
			}
			return new Card(Card.namesList[code], "spades");
		}
		if(code < 127167) {
			code -= 127153;
			if(code > 127164){
				code--;
			}
			return new Card(Card.namesList[code], "hearts");
		}
		if(code < 127183) {
			code -= 127169;
			if(code > 127180){
				code--;
			}
			return new Card(Card.namesList[code], "diamonds");
		}
		code -= 127185;
		if(code > 127196){
			code--;
		}
		return new Card(Card.namesList[code], "clubs");
	}
}

class Deck {
	constructor() {
		this.cardList = [];
        Card.suitsList.forEach((suit, i) => {
        	Card.namesList.forEach((name, j) => {
						this.cardList.push(new Card(name, suit));
        	});
        });
	}

	shuffle() {
    var j, x, i;
    for (i = this.cardList.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this.cardList[i];
        this.cardList[i] = this.cardList[j];
        this.cardList[j] = x;
    }
	}
}

class Player {
	constructor(socket) {
			this.cards = [];
			this.socket = socket;
      this.isTurn = false;
			this.index = NaN;
	}

	giveCards(cards) {
		this.cards = cards;
		let output = [];
		cards.forEach((card, i) => {
			output.push(card.toHTML());
		});
		this.socket.emit("cards", output);
		console.log(`sent cards to player ${this.index}`);
	}
}

export {Card, Game, Player, Deck};
