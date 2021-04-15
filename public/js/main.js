players = []
for (var i = 0; i < 5; i++) {
	if(i == 2) {
		continue;
	}
	let e = document.getElementsByClassName("cards")[i];
	let cardArray = [...e.children];
	cardArray.splice(2,1);
	players.push({element: e, cards: cardArray});
}

var hasStarted = false; //game has started bool
const socket = io();

players[players.length - 1].cards.forEach((e, i) => {
	e.addEventListener("click", function(){flip(e)})
  if(i > 1){
	  e.addEventListener("mouseover", function(){showCard(e)}); //clicking flips card
	  e.addEventListener("mouseout", function(){hideCard(e)}); //shows bottom cards when hovering
  }
});


function flip(element) {
	console.log("flip");
}

function showCard(element) {
  if(hasStarted) {
		card = cardList[players[players.length - 1].cards.indexOf(element)];
    element.innerHTML = card;
		let code = parseInt(card.substring(2, -1));
		if(code >= 127153 && code <= 127182) {
			element.style.color = "red";
		} else {
			element.style.color = "black";
		}
  }
}

function hideCard(element) {
  element.innerHTML = "&#127136;"; //HTML character code for back of a card
}

socket.on("start", () => {
  hasStarted = true;
  alert("Game has Started");
  console.log("Game has Started");
	document.getElementsByTagName("p")[0].style.display = "none";
	document.getElementById("game").style.display = "flex";
});

socket.on("playerjoined", (num) => {
	alert(`${num}/4 players`);
});

socket.on("cards", (cards) => {
	console.log("recived cards");
	console.log(cards);
	cardList = cards;
});

socket.on("your turn", () => {
	alert("It is your turn!");
});

socket.on("playerTurn", (index) => {
	alert(`It is player ${index}'s turn`);
});
