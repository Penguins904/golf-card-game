class Game {
  numOfPlayers = 4;

  constructer(room) {
    this.players = [];
		this.deck = new Deck();
		this.room = room;
  }

	start() {
		console.log("stsaring game");
	}
}

class Card {
  //name: 2, 3, 4...J, Q, K, A
  //suit: diamonds, hearts, clubs, spades
  //color: red, black
  //Face Card: J, Q, K, A
  //value: 2 = 2, 3 = 3, ..., J = 10, Q = 10, K = 0, A = 1
  //flipped: True, False

  suitsList = ["spades", "hearts", "diamonds", "clubs"]
  namesList = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

  constructer(name, suit) {
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
    this.flipped = false;
  }

  flip() {
    if (this.flipped){
      throw "card is already flipped";
    } else {
      this.flipped = true;
    }
  }

  toHTML() {
     var code = 0;
		 function getcode(num) {
		 	return num + Card.namesList.indexOf(self.name) + (Card.namesList.indexOf(self.name) > Card.namesList.indexOf("J"));
		 }
     switch (this.suits) {
		 	case "spades":
				code = getcode(127137);
				break;
			case "hearts":
				code = getcode(127153);
				break;
			case "diamonds":
				code = getcode(127153);
				break;
			case "clubs":
				code = getcode(127185);
				break;
     }
		 return "&#" + code + ";";
  }
}

class Deck {
	constructor() {
		this.cardList = [];
        for (suit in Card.suitsList) {
					for (name in Card.namesList) {
						this.cardList.append(Card(name, suit));
					}
				}
	}

	shuffle(this.cardList) {
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
	}

	sendCards() {
		this.socket.emit("cards", this.cards);
	}
}

exports.Game = Game;
exports.Card = Card;
exports.Player = Player;
exports.Deck = Deck;
