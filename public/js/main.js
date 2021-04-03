var div = document.getElementsByClassName("cards")[0]
var cardElements = [].slice.call(div.getElementsByTagName("span"));
var cards = []
var hasStarted, isTurn = false; //game has started bool

const socket = io();

for(let e of cardElements) {
  e.addEventListener("click", function(){flip(e)})
  if(cardElements.indexOf(e) > 1){
    e.addEventListener("mouseover", function(){showCard(e)}); //clicking flips card
    e.addEventListener("mouseout", function(){hideCard(e)}); //shows bottom cards when hovering
  }
}

function flip(element) {
  //ws.send(JSON.stringify({"action": "flip", "card": element.id}));
	console.log("flip");
}

function showCard(element) {
  if(hasStarted) {
    element.innerHTML = cards[cardElements.indexOf(element)];
  }
}

function hideCard(element) {
  element.innerHTML = "&#127136;"; //HTML character code for back of a card
}

socket.on("start", () => {
  hasStarted = true;
  alert("Game has Started");
  console.log("Game has Started");
});

socket.on("playerjoined", (num) => {
	alert(`${num}/4 players`);
});
