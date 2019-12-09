
var express = require('express'); // Get the express module
var app = express();
var serv = require('http').Server(app); // Here we create a server

app.get('/', function(req, res) { // If the request url does not exsist then 
	res.sendFile(__dirname + '/client/index.html'); // send them to the index
});
app.use('/client', express.static(__dirname + '/client')); // If the url equals the client, then send client contents

serv.listen(2000); // Here we make the server listen to the port 2000, which means that whenever there is a request to the port 2000, our server will be notified

console.log("Server started"); // Indication to show that server has started

var Player = function(id, name){
	var self = {
		id: id,
		username: name,
		hasPassed: false,
		points: 0,
		gameScore: 0
	}

	return self;
}

var createDeck = function(){
	// h s d c
	var deck = [];
	for(var i = 0; i < 4; i++){
		var suit = [];
		for(var j = 1; j <= 13; j++){
			suit.push(j);
		}
		deck[i] = suit;
	}
	return setCards(deck);
}

var setCards = function(deck){
	for(var i in deck){
		for(var j in deck[i]){
			if(deck[i][j] == 1){
				deck[i][j] = "Ace";
			} else if(deck[i][j] == 11){
				deck[i][j] = "Jack";
			} else if(deck[i][j] == 12){
				deck[i][j] = "Queen";
			} else if(deck[i][j] == 13){
				deck[i][j] = "King";
			}
		}
	}

	return deck;
}

var getSuit = function(suitNumber){
	if(suitNumber == 0){
		// heart
		return '♥';
	} else if(suitNumber == 1){
		// spade
		return '♠';
	} else if(suitNumber == 2){
		// diamond
		return '♦';
	} else if(suitNumber == 3){
		// clubs
		return '♣';
	}
}

var getSuitColor = function(suitNumber){
	if(suitNumber == 0 || suitNumber == 2){
		return 'red';
	} else if(suitNumber == 1 || suitNumber == 3){
		return 'black';
	}
}

var modifyDeck = function(deck, player_list){
	var amount = Object.keys(player_list).length;
	if((52 % amount) != 0){
		if(amount == 3){
			deck[3].splice(1, 1); // Removes 2 of clubs from deck
		} else if(amount == 5){
			deck[3].splice(1, 1); // Removes 2 of clubs from deck
			deck[2].splice(1, 1); // Removes 2 of diamonds from deck
		}
		return deck;
	}
	return deck; 
}

var boxInfoModifyDeck = function(player_list){
	var amount = Object.keys(player_list).length;
	if((52 % amount) != 0){
		if(amount == 3){
			//return "<u>Card removed is:</u> <span style='color: black; font-size: 20px;'>2♣</span>";
			return "<u>Card removed is:</u><br/><div style='margin-right: 15px; margin-bottom: 10px; border: 1px solid black; border-radius: 10px; width: 120px; padding-top: 10px; padding-bottom: 10px; text-align: center;'><span style='font-size: 27px; color: black;'>2♣</span></div>";
		} else if(amount == 5){
			//return "<u>Cards removed are:</u> <span style='color: black; font-size: 20px;'>2♣</span> and <span style='color: red; font-size: 20px;'>2♦</span>";
			return '<u>Cards removed are:</u><br /><div style="margin-right: 15px; margin-bottom: 10px; border: 1px solid black; border-radius: 10px; width: 120px; padding-top: 10px; padding-bottom: 10px; text-align: center;"><span style="font-size: 27px; color: black;">2♣</span></div><br /><div style="margin-right: 15px; margin-bottom: 10px; border: 1px solid black; border-radius: 10px; width: 120px; padding-top: 10px; padding-bottom: 10px; text-align: center;"><span style="font-size: 27px; color: red;">2♦</span></div>';
		}
	}

	return "";
}

var getDeckAmount = function(player_list){
	var amount = Object.keys(player_list).length;
	//console.log("Amount: " +(52%amount));
	if((52 % amount) != 0){
		if(amount == 3){
			return 51;
		} else if(amount == 5){
			return 50;
		}
	}
	return 52; 	
}

var contains = function(array, search, exact){
	for(var i in array){
		if(!exact){
			if(array[i] == search){
				return true;
			}
		} else{
			if(array[i] === search){
				return true;
			}
		}
			
	}
	return false;
}

var char_in_string = function(word, search){
	for(var i = 0; i < word.length; i++){
		if(word[i] == search){
			return true
		}
	}

	return false;
}

var word_in_string = function(string, search){
	string = string.split(" ");
	for(var word in string){
		if(string[word] == search){
			return true;
		}
	}

	return false;
}

var getSuitIcon = function(string){
	if(char_in_string(string, '♥')){
		return '♥';
	} else if(char_in_string(string, '♠')){
		return '♠';
	} else if(char_in_string(string, '♦')){
		return '♦';
	} else if(char_in_string(string, '♣')){
 		return '♣';
	}
}

/*var sortHand = function(hand){
	// h s d c
	var sortedHand = [];

	for(var i in deck){
		if(in_string(hand[i], '♥')){
			sortedHand[0]
		} else if(in_string(hand[i], '♠')){

		} else if(in_string(hand[i], '♦')){

		} else if(in_string(hand[i], '♣')){

		}
	}
}*/

var sortHand = function(hand){
	// h s d c
	var sortedHand = [[],[],[],[]];
	for(var i in hand.cards){
		var card_data = hand.cards[i];
		card_data.id = hand.id;
		sortedHand[getSuitIndex(getSuitIcon(card_data.card))].push(card_data);
	}

	return resetCardView(orderSortedHand(sortedHand));
}

var orderSortedHand = function(TwoDarray){

	for(var k in TwoDarray){ // 2D array of obj's
		var array = TwoDarray[k]; // Section of 2D array (certain suit) of obj's
		for(var i = 0; i < array.length; i++){

			for(var j = 0; j < array.length-1; j++){
				//console.log("Card 2: " +array[j].card);
				var cardNumberOne = getRawCardNumber(remove_suit(array[j].card, getSuitIcon(array[j].card)));
				var cardNumberTwo = getRawCardNumber(remove_suit(array[j+1].card, getSuitIcon(array[j+1].card)));
				if(cardNumberOne < cardNumberTwo){
					var temp = cardNumberOne;
					array[j].card = cardNumberTwo;
					array[j+1].card = temp;
				}
			}
		}
		TwoDarray[k] = array;
	}

	return TwoDarray;
}

var resetCardView = function(TwoDarray){
	// h s d c
	var resetCards = [[], [], [], []];
	for(var i in TwoDarray){
		var array = TwoDarray[i];
		for(var j in array){
			array[j].index = i;
			if(!hasSuit(array[j].card)){
				array[j].card = getCardName(array[j].card) +" " +getSuit(i);
			}
			resetCards[i].push(array[j]);
		}
	}

	return resetCards;
}

var dealHands = function(deck, player_list, socket_list){
	var hands = [];
	var removedSuits = [];
	var amount = Object.keys(player_list).length;
	var deck = modifyDeck(deck, player_list);
	for(var i in player_list){
		var hand = {};
		var cards = [];
		
		var player = player_list[i];
		hand.id = player.id;
		
		for(var j = 0; j < getDeckAmount(player_list)/amount; j++){
			// Get a random suit that exists within the deck
			var randSuit = Math.floor((deck.length) * Math.random());
			while(contains(removedSuits, randSuit, true)){
				randSuit = Math.floor((deck.length) * Math.random());
			}

			var indexCard = Math.floor((deck[randSuit].length) * Math.random());
			var randCard = deck[randSuit][indexCard];
			
			cards.push({
				card: randCard +" " +getSuit(randSuit),
				color: getSuitColor(randSuit)	
			});

			deck[randSuit].splice(indexCard, 1); // Remove the card from the deck

			if(!(deck[randSuit].length > 0)){
				removedSuits.push(randSuit);
			}
		}
	
		hand.cards = cards;
		socket_list[i].emit("handData", sortHand(hand));
		//socket_list[i].emit("handData", hand);
		
		socket_list[i].emit("box-info", boxInfoModifyDeck(player_list)); 	
		
		hands.push(hand);
	}
}

var remove_suit = function(word, suit){
	if(!char_in_string(word, " ")) return word; 
	word = word.split(" ");
	string = "";
	for(var character in word){
		if((word[character] != suit) && (word[character] != ' ')){
			string += word[character];
		}
	}

	return string;
}

var hasSuit = function(card){
	if(!char_in_string(card, " ")) return false;
	return true;
}

var getCardNumber = function(card){
	if(word_in_string(card, "King")){
		return "13 " +getSuitIcon(card);
	} else if(word_in_string(card, "Queen")){
		return "12 " +getSuitIcon(card);
	} else if(word_in_string(card, "Jack")){
		return "11 " +getSuitIcon(card);
	} else if(word_in_string(card, "Ace")){
		return "14 " +getSuitIcon(card);
	}

	return card;
}

var getRawCardNumber = function(card){
	if(card == "King"){
		return 13;
	} else if(card == "Queen"){
		return 12;
	} else if(card == "Jack"){
		return 11;
	} else if(card == "Ace"){
		return 14;
	}

	return parseInt(card);
}

var getCardName = function(card_number){
	if(card_number == 14){
		return "Ace";			
	} else if(card_number == 13){
		return "King";
	} else if(card_number == 12){
		return "Queen";
	} else if(card_number == 11){
		return "Jack";
	}

	return card_number;
}

var getPointsPerCard = function(card){
	if(card == 14) return 15;
	if((card >= 11) && (card <= 13)) return 10;
	if(card <= 10) return 5;
}

var calculatePoints = function(number_card){
	var points = 0; 
	for(var i in number_card[0]){
		points += getPointsPerCard(number_card[0][i]);
	}
	if(contains(number_card[1], "12")) points += 25;
	return points;
}

var getCardOwner = function(cards, card, index){
	var searchCard = card +" " +getSuit(index);
	//console.log(searchCard);
	for(var card in cards){
		var foundCard = getCardNumber(cards[card].card);
		if(foundCard === searchCard){
			return cards[card].owner;
		}
	}
}

var getPointCollector = function(cards){
	var leadCard = cards[0].card;
	var leadCardSuit = getSuitIndex(getSuitIcon(leadCard));
	for(var card in cards){
		cards[card].card = getCardNumber(cards[card].card);
		number_card[getSuitIndex(getSuitIcon(cards[card].card))].push(remove_suit(cards[card].card, getSuitIcon(cards[card].card)));
	}

	return getCardOwner(cardsPlaced, getHighestNumber(number_card[leadCardSuit]), leadCardSuit);	
}

var getSuitIndex = function(suit){
	if(getSuitIcon(suit) == '♥'){
		return 0;
	} else if(getSuitIcon(suit) == '♠'){
		return 1;
	} else if(getSuitIcon(suit) == '♦'){
		return 2;
	} else if(getSuitIcon(suit) == '♣'){
		return 3;
	}
	return -1;
}

var getHighestNumber = function(array){
	var high = 0;
	for(var i = 0; i < array.length; i++){
		if((typeof array[i]) == "string") array[i] = parseInt(array[i]);
		

		if(array[i] > high) high = array[i];
	}
	return high;
}

var SOCKET_LIST = {};
var PLAYER_LIST = {};
//var DEL_PASS_PLAYER_LIST = JSON.parse(JSON.stringify(PLAYER_LIST));
var PASS_PLAYER_LIST = {};

var io = require("socket.io")(serv, {});

var startingPlayer = 0;
var turnId = 0;
var allocatedStart = false;
var cardsPlaced = [];
var number_card = [[], [], [], []];
var point_getter = 0;

var rounds = 0;
var gameNumber = 1;

var printed = false;
var player = null; 

io.sockets.on('connection', function(socket){

	socket.on('start', function(){
		var deck = createDeck();
		dealHands(deck, PLAYER_LIST, SOCKET_LIST); 
	});

	socket.on('card', function(data){
		turnId = PASS_PLAYER_LIST[turnId];
		cardsPlaced.push(data);
		
		for(var i in SOCKET_LIST){
			let a_socket = SOCKET_LIST[i];
			//console.log("Stringified player list: ", JSON.stringify(SOCKET_LIST));
			//console.log("The owner", data.owner);
			console.log("Card data", JSON.stringify(data));
			a_socket.emit('box-info', PLAYER_LIST[data.owner].username +" placed down a card!");
			a_socket.emit('showCardPlace', "<div title='" +PLAYER_LIST[data.owner].username +"' class='card card-box pass-card " +data.card.replace(/ /g,'') +"' style='display: inline-block; margin-right: 15px; margin-bottom: 10px; border: 1px solid black; border-radius: 10px; width: 120px; padding-top: 10px; padding-bottom: 10px; margin-top: 10px; text-align: center;'><span class='card' id='" +data.card +"' style='font-size: 27px; color: " +data.color +";'>" +data.card +"</span></div></span>")
			//socket.emit('box-info', "<u>It is now " +PLAYER_LIST[turnId].username +"'s' turn!");
		}

		if(cardsPlaced.length == Object.keys(PLAYER_LIST).length){
			// Allocate points...
			point_getter = getPointCollector(cardsPlaced);
			turnId = point_getter;

			SOCKET_LIST[point_getter].emit('pickUpCardsButton');
			PLAYER_LIST[point_getter].points += calculatePoints(number_card);
			PLAYER_LIST[point_getter].gameScore += calculatePoints(number_card);

			if(calculatePoints(number_card) != 0){
				SOCKET_LIST[turnId].emit('box-info', "<u><b><span style='color: red; text-align: center; font-size: 23px;''>Points received: +" +calculatePoints(number_card) +" </span></b></u>");
				SOCKET_LIST[turnId].emit('pointGetter');
			}

			number_card = [[], [], [], []];
			cardsPlaced = [];
			//gameNumber++;			
		} else{
			SOCKET_LIST[turnId].emit('allowTurn');
		}


		emitAll('box-info', "<u>It is now " +PLAYER_LIST[turnId].username +"'s turn!</u>");
		SOCKET_LIST[turnId].emit('box-info', "<u><b>It is now your turn!</b></u>");
		//console.log("The card that " +PLAYER_LIST[data.owner].username +" placed down was a " +data.color +" " +data.card);
	});

	socket.on("playerChat", function(data){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('box-info', "<u><b>" +PLAYER_LIST[socket.id].username +"</b></u>: " +data);
		}
	});

	socket.on("pickupCards", function(){
		for(var i in SOCKET_LIST){
			var so = SOCKET_LIST[i];
			so.emit('removeCardsFromTable');
		}
		//emitAll('removeCardsFromTable');
		//Tesing: rounds = 1;
		if(rounds-1 == 0){
			emitAll('box-info', "Game/Round Over");
			console.log("game/round over");

			for(var i in PLAYER_LIST){
				var player = PLAYER_LIST[i];
				player.gameScore = 0;
				player.hasPassed = false;
			}

			gameNumber++;
			emitAll('startNewRoundData', gameNumber);
			SOCKET_LIST[turnId].emit('startNewRound');

			startingPlayer = PASS_PLAYER_LIST[startingPlayer];
		
			cardsPlaced = [];
			number_card = [[], [], [], []];
			point_getter = 0;
			rounds = getDeckAmount(PLAYER_LIST)/(Object.keys(PLAYER_LIST).length) + 1;
			printed = false;
			
		}

		var pack = [];
		for(var i in PLAYER_LIST){
			var player = PLAYER_LIST[i];
			pack.push({username: player.username, gameScore: player.gameScore, points: player.points});
		}		
		emitAll('showScores', pack);

		emitAll('box-info', "<u>It is now " +PLAYER_LIST[turnId].username +"'s' turn!");
		SOCKET_LIST[turnId].emit('box-info', "<u><b>It is now your turn!</b></u>");
		rounds--;
	});

	socket.on('createPlayer', function(data){
		
		if(Object.keys(PLAYER_LIST).length < 5){
			console.log(data +" joined the game!");
			for(var i in SOCKET_LIST){
				var so = SOCKET_LIST[i];
				so.emit('box-info', data +" joined the game!");
			}
			player = Player(socket.id, data);
			SOCKET_LIST[socket.id] = socket;
			PLAYER_LIST[player.id] = player;
		} else{
			console.log(data +" tried to join the game but the lobby was full");
			socket.emit("fullGame", "<center><span style='color: red;'>Sorry, this game is full!</span></center>");
			return;
		}

		rounds = getDeckAmount(PLAYER_LIST)/(Object.keys(PLAYER_LIST).length);
	});

	socket.on("getPlayerUsernames", function(){
		var players = "Players: \n";
		for(var i in PLAYER_LIST){
			var player = PLAYER_LIST[i];
			players += "- " +player.username +"\n";
		}

		socket.emit("playerUsernames", players);
	});

	socket.on('getPassPlayer', function(){
		//var DEL_PASS_PLAYER_LIST = JSON.parse(JSON.stringify(PLAYER_LIST));
		var j = 0;
		for(var i in SOCKET_LIST){
			var finish = false;
			let a_socket = SOCKET_LIST[i];
			var inc = 1;
			
			if((j+inc) == Object.keys(PLAYER_LIST).length){
				j = 0;
				inc = 0;
				finish = true;
			}
			
			if(PLAYER_LIST[Object.keys(PLAYER_LIST)[j+inc]].id == a_socket.id) inc = 2;
			
			a_socket.emit("box-info", "<br /><b><u>You are passing to: " +PLAYER_LIST[Object.keys(PLAYER_LIST)[j+inc]].username +"</u></b><br />");
			PASS_PLAYER_LIST[a_socket.id] = PLAYER_LIST[Object.keys(PLAYER_LIST)[j+inc]].id;	

			if(finish){
				j = Object.keys(PLAYER_LIST).length;
			}
			j++;				
		}
	});

	socket.on('getPassedCards', function(card_data){
		var pack = [];
		for(var i in card_data){
			var data = card_data[i];

			PLAYER_LIST[data.owner].hasPassed = true;
			SOCKET_LIST[PASS_PLAYER_LIST[data.owner]].emit('passedCards', {color: data.color, card: data.card, id: PASS_PLAYER_LIST[data.owner], index: data.index});
			pack.push({old_owner_name: PLAYER_LIST[data.owner].username, owner_name: PLAYER_LIST[PASS_PLAYER_LIST[data.owner]].username});
		}


		for(var i in SOCKET_LIST){
			let a_socket = SOCKET_LIST[i];
			var prevOwner = "";
			for(var k in pack){
				var data = pack[k];
				if(prevOwner != data.old_owner_name){
					prevOwner = data.old_owner_name;
					a_socket.emit('box-info', data.old_owner_name +" passed 3 cards to " +data.owner_name);
					if(allPlayersPassed(PLAYER_LIST)){
						a_socket.emit('startGameMode');
					}
				}
			}
		}
	});

	socket.on('choosePlayer', function(){
		if(!allocatedStart && !printed){
			startingPlayer = Math.floor(((Object.keys(PLAYER_LIST).length) * Math.random()));
			turnId = startingPlayer = PLAYER_LIST[Object.keys(PLAYER_LIST)[startingPlayer]].id;
			for(var i in SOCKET_LIST){
				let a_socket = SOCKET_LIST[i];
				a_socket.emit('box-info', "<u>" +PLAYER_LIST[startingPlayer].username +" will go first!</u>");
				//console.log(PLAYER_LIST[startingPlayer] +" will go first!");
			}
			SOCKET_LIST[startingPlayer].emit('allowTurn');
			SOCKET_LIST[startingPlayer].emit('box-info', "<b>It is now your turn!</b>");
			allocatedStart = true;
			printed = true;
		} else if(!printed){
			emitAll('box-info', "<u>It is now " +PLAYER_LIST[turnId].username +"'s' turn!");
			SOCKET_LIST[turnId].emit('box-info', "<u><b>It is now your turn!</b></u>");
			SOCKET_LIST[turnId].emit('allowTurn');
			printed = true;
		}

	});

	socket.on('disconnect', function(){
		if(socket.id in PLAYER_LIST) { // check if the socket is actually playing (ie: not in the "game full" lobby area of the server)
			let {username} = PLAYER_LIST[socket.id];
			console.log(username +" left the game!");
			for(var i in SOCKET_LIST){
				let a_socket = SOCKET_LIST[i];
				a_socket.emit('box-info', username +" left the game!");
			}

			delete SOCKET_LIST[socket.id];
			delete PLAYER_LIST[socket.id];
		}
	});
});

function emitAll(location, data){
	for(var i in SOCKET_LIST){
		let a_socket = SOCKET_LIST[i];
		a_socket.emit(location, data);
	}
}

function allPlayersPassed(player_list){
	for(var i in player_list){
		var player = player_list[i];
		if(player.hasPassed == false){
			return false;
		}
	}

	return true;
}

function containsWithinObj(obj, search){
	for(var i in obj){
		if(i == search){
			return true;
		} else if(obj[i] == search){
			return true;
		}
	}

	return false;
}

function showObj(obj){
	for(var i in obj){
		
		for(var j in obj[i]){
			//console.log("key: " +i +" val: " +obj[i]);
			//console.log("**************");
			console.log("key: " +j +" val: " +obj[i][j]);
			//for(var k in obj[i][j]){
			//	console.log("Key: " +k +" Val: " +obj[i][j][k]);
			//}
		}
	}
}