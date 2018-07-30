const cardColors = { 0: "blue", 1: "red", 2: "green", 3: "yellow" }
const numOfColors = 4;
const numOfCardsForEachPlayer = 5;
let setStateInBoardCB;
let takenCardsCounter = 0;
let turnIndex = 2;
let openTaki = false;
let gameOver = false;
let cardOnTop = null;
let players = [];
let gameStarted = false;
let plus2 = 0;
let transformArrow = 0;
let gameMove = [];
let arrIndex = 0;
let avg = 0;
let avgPerGame = 0;
let is3Games = false;
let gameNum = 1;
let tournamentIsDone = false;

//statistics
//let turnTime = [];
//let avgTurnTimePerGame = [];
let timeInterval;
let fullTime = "";
let startTime = "00:01";
let endTime;
let sec = 0;
let min = 0;
let stopTimer = false;


//let prevIndex = 1;

//sounds
let takingCard;
let wrongSound;
let changeColorSound;
let winnerSound;
let loserSound;
let shuffleSound;

// function newGame() {
//     prevIndex = 1;
//     players = [];
//     turnIndex = 2;
//     takenCardsCounter = 0;
//     gameOver = false;
//     gameMove = [];
//     numOfTurns = 0;
//     turnTime = [];
//     cardOnTop = null;
//     openTaki = false;
//     plus2 = 0;
//     gameStarted = false;
//     transformArrow = 0;
//     fullTime = "";
//     startTime = "00:01";
//     endTime;
//     sec = 0;
//     min = 0;
//     stopTimer = false;
//     clearInterval(timeInterval);
//     this.setSounds();
//     gameNum = 1;
//     is3Games = false;

// }

function setSounds() {
    wrongSound = new Audio();
    wrongSound.src = "sounds/wrong.mp3";
    changeColorSound = new Audio();
    changeColorSound.src = "sounds/changeColorSound.mp3";
    winnerSound = new Audio();
    winnerSound.src = "sounds/winner.mp3";
    loserSound = new Audio();
    loserSound.src = "sounds/Fail.mp3";
    shuffleSound = new Audio();
    shuffleSound.src = "sounds/Shuffling Cards.mp3";
    takingCard = new Audio();
    takingCard.src = "sounds/takingCard.mp3";
}

function setAvgPerGame() {
    setStateInBoardCB("avgTimeForTurnPerGame", avgPerGame, false);
}

function addMove(state) {
    gameMove.push(JSON.parse(JSON.stringify(state)));
};

function checkPrevIndex() {
    return prevIndex === gameMove.length;
}

function checkNextIndex() {
    return prevIndex === 0;
}

function getPrev() {
    if (prevIndex < gameMove.length) {
        prevIndex++;
    }
    return gameMove[gameMove.length - prevIndex];
};

function getNext() {
    if (prevIndex > 1) {
        prevIndex--;
    }
    return gameMove[gameMove.length - prevIndex];
};

function isGameOver() {
    return gameOver;
}

function setCbFucntions(setStateInBoard) {
    setStateInBoardCB = setStateInBoard;
}

//add to reset all
function defultParams() {
    takenCardsCounter = 0;
}

function createCard(color, value, counterId, specialCard, points) {
    return {
        color: color,
        value: value,
        taken: false,
        played: false,
        specialCard: specialCard,
        cardId: counterId,
        isOpenCard: false,
        points: points,
        imgSourceFront: getCardSource(value, color),
        imgSourceBack: './resources/cards/card_back.png'
    }
}

function getCardSource(value, color) {
    let cardSource;
    if (value === "change_colorful" || value === "taki_colorful") {
        cardSource = `./resources/cards/${value}.png`;
    }
    else {
        cardSource = `./resources/cards/${value}_${color}.png`;
    }
    return cardSource;
}


function createDeck() {
    const deck = [];
    let cardIdCounter = 0;

    for (let i = 0; i < numOfColors; i++) {
        for (let j = 1; j < 10; j++) {
            for (let k = 0; k < 2; k++) {
                if (j !== 2) {
                    deck.push(createCard(cardColors[i], j, cardIdCounter, false, j));
                    cardIdCounter++;
                }
                else {
                    deck.push(createCard(cardColors[i], j + 'plus', cardIdCounter, true, 10));
                    cardIdCounter++;
                }
            }
        }
        for (let j = 0; j < 2; j++) {
            deck.push(createCard(cardColors[i], "taki", cardIdCounter, true, 15));
            cardIdCounter++;
            deck.push(createCard(cardColors[i], "stop", cardIdCounter, true, 10));
            cardIdCounter++;
            deck.push(createCard(cardColors[i], "plus", cardIdCounter, true, 10));
            cardIdCounter++;
        }
        if (i < 2) {
            deck.push(createCard(null, "taki_colorful", cardIdCounter, true, 15));
            cardIdCounter++;
        }
        deck.push(createCard(null, "change_colorful", cardIdCounter, true, 15));
        cardIdCounter++;
    }
    return deck;
}

function shareCardsToPlayers(numOfPlayers, gameData) {
    const players = [];
    for (let playerIndex = 0; playerIndex < numOfPlayers; playerIndex++) {
        players.push({
            index: playerIndex,
            name: gameData.playersName[playerIndex],
            cards: [],
            score: 0,
            showCards: true,
            oneCardLeftCounter: 0,
            ImDoneIsHidden: true,
            changeColorWindowIsOpen: false,
            noCardsLeft: false,
            watcher: false,
            startTime: "00:01",
            endTime: "",
            turnTime: [],
            avg: 0
        });

        if (playerIndex !== numOfPlayers - 1) {
            players[playerIndex].showCards = false;
        }
        players[playerIndex].cards = shareCards(gameData);
    }
    return players;
}

function shareCards(gameData) {
    const cards = [];
    for (let i = 0; i < numOfCardsForEachPlayer; i++) {
        addCardToPlayersArr(cards, gameData);
    }
    return cards;
}

function startNewGameInTournament(deck) {
    for (let key in deck) {
        if (deck[key].value === "taki_colorful" || deck[key].value === "change_colorful") {
            deck[key].color = null;
            deck[key].imgSourceFront = this.getCardSource(deck[key].value, deck[key].color);
        }
        deck[key].played = false;
        deck[key].taken = false;
    }

    for (let key in players) {
        players[key].cards = this.shareCards(deck);
        players[key].oneCardLeftCounter = 0;
    }
    //setStateInBoardCB('players', players, false);

    cardOnTop = this.drawOpeningCard(deck);
    setStateInBoardCB('cardOnTop', cardOnTop);
}

function addCardToPlayersArr(arrToAddTheCard, gameData) {
    let cardIndex;
    do {
        cardIndex = Math.floor(Math.random() * gameData.deck.length);
    } while (gameData.deck[cardIndex].taken === true);
    gameData.deck[cardIndex].taken = true;
    addTakenCardCounter(gameData);
    arrToAddTheCard.push(gameData.deck[cardIndex]);
    // if (gameData.turnIndex === gameData.players[0].index) {
    //     setTimeout(() => setStateInBoardCB('players', gameData.players, false), 2000);
    // }
    // else {
    //     setStateInBoardCB('players', players, false);
    // }
    //resizeCards();
    if (gameData.gameStarted) {
        //console.log("@@@@Before changing turn!@@@");
        //takingCard.play();
        //console.log("player 1: " + players[0].cards);
        //console.log("player 2: " + players[1].cards);
        if (gameData.plus2 > 0) {
            gameData.plus2--;
        }
        if (gameData.plus2 === 0) {
            changeTurn(1, gameData);
        }
    }
}

function addTakenCardCounter(gameData) {
    gameData.takenCardsCounter++;
    //setStateInBoardCB('takenCardsCounter', takenCardsCounter, false);
    if (gameData.takenCardsCounter === gameData.deck.length) {
        //shuffleSound.play();
        for (let i = 0; i < deck.length; i++) {
            if (gameData.deck[i].played) {
                gameData.deck[i].played = false;
                gameData.deck[i].taken = false;
                gameData.takenCardsCounter--;
            }
        }
    }
}

function setTournament() {
    is3Games = true;
}

function checkCard(card, playerName, gameData) {
    let isPlayerTurn = checkPlayerTurn(playerName, gameData);
    //console.log("is player turn: " + isPlayerTurn);

    if (isPlayerTurn) {
        if (gameData.openTaki) {
            if (checkValidCard(card, gameData)) {
                //console.log("gameData.players[turnIndex] = " + gameData.players[gameData.turnIndex]);
                removeAndSetTopCard(gameData.players[gameData.turnIndex], card, gameData);
            }
            else {
                //console.log("open taki - card is not valid");
                //wrongSound.play();
            }
        }
        else {
            if (checkValidCard(card, gameData)) {
                let cardOnTopColor = gameData.cardOnTop.color;
                //console.log("gameData.players[turnIndex] = " + gameData.players[gameData.turnIndex]);
                removeAndSetTopCard(gameData.players[gameData.turnIndex], card, gameData);
                isSpecialCard(gameData.players[gameData.turnIndex], gameData, cardOnTopColor);
            }
            else {
                if (plus2 > 0) {
                    //alert(`you have to take ${plus2} cards from deck!`);
                }
                else {
                    //alert("wrong!");
                    //wrongSound.play();
                }
            }
        }
    }
    else {
        //alert("wrong!");
        //wrongSound.play();
    }
    // console.log("changeColorWindowIsOpen: " + result.changeColorWindowIsOpen +
    //     " ImDoneIsHidden:" + result.ImDoneIsHidden);
}


function checkValidCard(card, gameData) {
    let isValid = false;
    if (gameData.openTaki) {
        if (card.color === gameData.cardOnTop.color) {
            isValid = true;
        }
    }
    else {
        if (gameData.plus2 > 0) {
            if (card.value === "2plus") {
                isValid = true;
            }
        }
        else {
            if (card.color === gameData.cardOnTop.color || card.value === gameData.cardOnTop.value || card.value === "change_colorful" || card.value === "taki_colorful") {
                isValid = true;
            }
        }
    }
    return isValid;
}

function removeAndSetTopCard(player, card, gameData) {
    //console.log("player data: " + player);
    removeCardFromPlayersArr(player, card);
    setNewcardOnTop(card, gameData);
    if (player.cards.length === 1) {
        player.oneCardLeftCounter++;
    }
    //setStateInBoardCB('players', players, false);
    //this.printPlayersCards();
}

function printPlayersCards() {
    for (let i = 0; i < 2; i++) {
        console.log("cards of player " + (i + 1) + ":");
        for (let key in players[i].cards) {
            console.log(players[i].cards[key])
        }
    }
}

function removeCardFromPlayersArr(player, card) {
    //console.log("player data: " + player);
    for (let key in player.cards) {
        if (player.cards[key].cardId === card.cardId) {
            player.cards.splice(player.cards.indexOf(player.cards[key]), 1);
            break;
        }
    }
    //this.resizeCards();
    //setStateInBoardCB("players", players, false);
}

function setColorToTopCard(color, gameData) {
    //changeColorSound.play();
    gameData.players[gameData.turnIndex].changeColorWindowIsOpen = false;
    let newCard = gameData.cardOnTop;
    newCard.color = color;
    newCard.imgSourceFront = `./resources/cards/change_colorful_${color}.png`;
    setNewcardOnTop(newCard, gameData);
    checkPlayerWin(gameData.players[gameData.turnIndex], 1, gameData);
}

function setNewcardOnTop(cardToPutOnTop, gameData) {
    gameData.deck[gameData.cardOnTop.cardId].played = true;
    gameData.cardOnTop = cardToPutOnTop;
    //setStateInBoardCB('cardOnTop', cardOnTop);
}

function isSpecialCard(player, gameData, cardOnTopColor) {
    if (gameData.cardOnTop.value === "2plus") {
        gameData.plus2 += 2;
        checkPlayerWin(player, 1, gameData);
    }
    else if (gameData.cardOnTop.value === "change_colorful") {
        //setStateInBoardCB('changeColorWindowIsOpen', true, false);
        //this.changeTurn(this.checkTopCard(), numOfPlayers, deck);
        player.changeColorWindowIsOpen = true;
    }
    else if (gameData.cardOnTop.value === "stop") {
        if (player.cards.length === 0) {
            //alert("stop the game");
            checkPlayerWin(player, 2, gameData);
            // //to do!!
            // stopTheGame();
        }
        else {
            changeTurn(2, gameData);
        }
    }
    else if (gameData.cardOnTop.value === "taki" || gameData.cardOnTop.value === "taki_colorful") {
        if (!gameData.openTaki) {
            player.ImDoneIsHidden = false;
            gameData.openTaki = true;
        }

        if (gameData.cardOnTop.value === "taki_colorful") {
            //change the color of the taki to the cardOnTop.color
            gameData.cardOnTop.color = cardOnTopColor;
            gameData.cardOnTop.value = "taki";
            gameData.cardOnTop.imgSourceFront = getCardSource("taki", cardOnTopColor);
        }
    }
    else if (gameData.cardOnTop.value === "plus") {
        console.log("player put plus card! ");
        //add 1 turn to statistics
        changeTurn(gameData.numOfPlayers, gameData);
    }
    else { // not a special card
        checkPlayerWin(player, 1, gameData);
    }
}

function rivalActionForTakiCard(player, numOfPlayers, deck) {
    let SameColorCards = this.getCardsFromRivalArrbByColor(player.cards, cardOnTop.color);
    if (SameColorCards.length > 0) {
        openTaki = true;
        let takiTime = setInterval(() => { this.newTimeOut(player, deck, numOfPlayers, SameColorCards, takiTime) }, 2000);
    }
    else {
        this.checkPlayerWin(player, 1, numOfPlayers, deck);
    }
}


function newTimeOut(player, deck, numOfPlayers, arrOfSameCards, takiTime) {
    if (arrIndex < arrOfSameCards.length) {
        this.removeAndSetTopCard(player, arrOfSameCards[arrIndex], deck);
        arrIndex++;
    }
    else {
        clearTimeout(takiTime);
        openTaki = false;
        arrIndex = 0;
        this.checkPlayerWin(player, 1, numOfPlayers, deck);
    }
}

function gameTimer(gameData) {
    console.log("ENTER GAMETIMER!!!");
    timeInterval = setInterval(function () { timeHandler() }, 1000);
}

function timeHandler(gameStat) {

    if (!stopTimer) {
        if (++sec === 60) {
            sec = 0;
            ++min;
        }
        fullTime = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
        console.log("server timer: " + fullTime);
    }
    else {
        clearInterval(timeInterval);
    }
}
// //setInterval(handler, 1000);
// gameData.gameStat.timeInterval = setInterval(handler, 1000);
// handler(gameData.gameStat);


function findAvgOfTurnTime(gameData) {
    let sum = 0;
    for (let i = 0; i < gameData.players[gameData.turnIndex].turnTime.length; i++) {
        sum += gameData.players[gameData.turnIndex].turnTime[i];
    }
    let avgNum = Number(sum / gameData.players[gameData.turnIndex].turnTime.length);
    gameData.players[gameData.turnIndex].avg = Number(avgNum.toFixed(2));
    console.log("AVG: " + gameData.players[gameData.turnIndex].avg);
}

function changeTurn(number, gameData) {
    console.log("**** change TURN ******");
    console.log("turnIndex before changing turn" + gameData.turnIndex);
    //console.log("numofplayers " + gameData.numOfPlayers);
    gameData.players[gameData.turnIndex].endTime = fullTime;
    setTurnTime(gameData);
    gameData.turnIndex = (gameData.turnIndex + number) % gameData.numOfPlayers;
    while (gameData.players[gameData.turnIndex].noCardsLeft === true) {
        gameData.turnIndex = (gameData.turnIndex + 1) % gameData.numOfPlayers;
    }
    gameData.players[gameData.turnIndex].startTime = fullTime;
    console.log("turnIndex after changing turn" + gameData.turnIndex);
    gameData.numOfTurns++;
}


// function changeTurn(number, numOfPlayers, gameData) {
//     console.log("**** change TURN ******")
//     endTime = fullTime;
//     if (gameData.openTaki) {
//         rivalPlay(gameData.deck, numOfPlayers);
//     }
//     else {
//         console.log("turnIndex Before CHANGING : " + gameData.turnIndex);
//         if (gameData.turnIndex === gameData.players[1].index) {
//             //setTurnTime(endTime);
//             //this.rotateArrow();
//         }
//         if (number === numOfPlayers) {
//             if (gameData.cardOnTop.value === "stop") {
//                 gameData.numOfTurns += number;
//             }
//             else {
//                 gameData.numOfTurns++;
//             }
//         }
//         else {
//             //this.rotateArrow();
//             gameData.numOfTurns += number;

//         }
//         //this.rotateArrow();
//         //console.log("before chnging turn: " + turnIndex);
//         let saveTurnIndex = gameData.turnIndex;
//         gameData.turnIndex = ((gameData.turnIndex - 1) + number) % numOfPlayers + 1;
//         // setStateInBoardCB('turnIndex', turnIndex);
//         // setStateInBoardCB('numOfTurns', numOfTurns, false);
//         if (saveTurnIndex !== gameData.turnIndex) {
//             //rotateArrow();
//         }
//         //console.log("after chnging turn: " + turnIndex);
//         startTime = fullTime;

//         if (gameData.turnIndex !== numOfPlayers) {
//             //console.log("rivals turn");
//             //this.rivalPlay(deck, numOfPlayers)
//             //setTimeout(() => { this.rivalPlay(deck, numOfPlayers) }, 2000);
//         }
//     }
// }


function setTurnTime(gameData) {
    //if (turnIndex === players[1].index) {
    let start = gameData.players[gameData.turnIndex].startTime.split(":");
    let startMin = Number(start[0]);
    startMin = startMin * 60;
    let startSec = Number(start[1]);
    let fullStartTimeInSec = startMin + startSec;

    let end = gameData.players[gameData.turnIndex].endTime.split(":");
    let endMin = Number(end[0]);
    endMin = endMin * 60;
    let endSec = Number(end[1]);
    let fullendTimeInSec = endMin + endSec;
    gameData.players[gameData.turnIndex].turnTime.push(fullendTimeInSec - fullStartTimeInSec);
    findAvgOfTurnTime(gameData);
    //}
}


function playerHasNo2PlusCards(player, numOfPlayers, deck) {
    let res = true;
    if (getCardsFromRivalArrbByValue(player.cards, "2plus").length > 0) {
        res = false;
    }
    return res;
}

function checkPlayerWin(player, num, gameData) {
    console.log("**checkPlayerWin**")
    if (player.cards.length === 0) {
        console.log("***no cards left for player: " + player.index);
        player.noCardsLeft = true;
        gameData.playersWithCards--;
        console.log("gameData.playersWithCards = " + gameData.playersWithCards);
        if (gameData.playersWithCards === 1) {
            gameData.gameOver = true;
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ ---- GAME --- OVER ----@@@@@@@@@@@@@@@@@@@@@@")
            stopTheGame(gameData);
        }
        else {
            changeTurn(num, gameData);
        }
        //todo!!
        //turnIndex === gameData.players[gameData.turnIndex].index ? winnerSound.play() : loserSound.play();
        //alert(gameData.playersName[gameData.turnIndex]+ " wins!")
        //setTimeout(() => { this.stopTheGame(deck) }, 1000);
    }
    else {
        changeTurn(num, gameData);
    }
}

function stopTheGame(gameData)
{
    // avgTurnTimePerGame.push(avg);
    // this.findAvgOfTurnTime(avgTurnTimePerGame, true);
    // endTime = fullTime;
    stopTimer = true;
    fullTime = "";
    startTime = "00:01"
    // gameOver = true;
    //alert("game over");
}

function checkTopCard(gameData) {
    var nextTurn = 1;
    if (gameData.cardOnTop.value === "stop") {
        nextTurn = 2;
    }
    if (gameData.cardOnTop.value === "plus") {
        nextTurn = 0;
    }
    return nextTurn;
}

function drawOpeningCard(gameData) {
    let CardIndex;
    do {
        CardIndex = Math.floor(Math.random() * gameData.deck.length);
    } while (gameData.deck[CardIndex].taken || gameData.deck[CardIndex].specialCard);
    gameData.deck[CardIndex].taken = true;
    addTakenCardCounter(gameData);
    gameData.cardOnTop = gameData.deck[CardIndex];
    gameData.gameStarted = true;

    //this.printPlayersCards();
    //setStateInBoardCB('cardOnTop',cardOnTop);
    return gameData.deck[CardIndex];
}

function checkStatusOnTableDeckClicked(playerName, gameData) {
    // console.log("*****checkStatusOnTableDeckClicked*****");
    if (!gameData.gameOver) {
        let isPlayerTurn = checkPlayerTurn(playerName, gameData);
        if (isPlayerTurn) {
            if (gameData.plus2 > 0) {
                if (playerHasNo2PlusCards(gameData.players[gameData.turnIndex], gameData.numOfPlayers, gameData.deck)) {
                    let numOfCardsPlayerHasToTake = gameData.plus2;
                    for (let i = 0; i < numOfCardsPlayerHasToTake; i++) {
                        addCardToPlayersArr(gameData.players[gameData.turnIndex].cards, gameData);
                    }
                }
            }
            else {
                let hasCardsToUse = checkPlayerCards(gameData.turnIndex, gameData);
                if (hasCardsToUse) {
                    //wrongSound.play();
                }
                else if (!hasCardsToUse && !openTaki) {
                    addCardToPlayersArr(gameData.players[gameData.turnIndex].cards, gameData);
                }
            }
        }
    }
}

function checkPlayerCards(playerIndex, gameData) {
    const cards = gameData.players[playerIndex].cards;
    console.log(cards);
    let res = false;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].value === gameData.cardOnTop.value || cards[i].color === gameData.cardOnTop.color ||
            cards[i].value === "change_colorful" || cards[i].value === "taki_colorful") {
            res = true;
            break;
        }
    }
    return res;
}

function checkPlayerTurn(player, gameData) {
    console.log("checkPlayerTurn");
    console.log(" turnIndex " + gameData.turnIndex);
    const playerIndex = gameData.playersName.findIndex((pl) => pl === player);
    console.log(" playerIndex " + playerIndex);

    let res = false;
    if (gameData.turnIndex === playerIndex) {
        res = true;
    }
    else {
        console.log("Not your turn!!!!!!!!!!!!!!!!!!!!!!");
    }
    return res;
}

function rivalPlay(deck, numOfPlayers) {
    let goodCardFound = false;
    if (!gameOver) {
        goodCardFound = false;
        let plus2Cards = this.getCardsFromRivalArrbByValue(players[0].cards, "2plus");
        if (plus2Cards.length > 0) {  // 2plus card exist 
            if (plus2 > 0 || cardOnTop.value === "2plus") { // there is an active/not active 2plus card on deck
                this.removeAndSetTopCard(players[0], plus2Cards[0], deck);
                plus2 += 2;
                checkPlayerWin(players[0], 1, numOfPlayers, deck);
                goodCardFound = true;
            }
            else {
                goodCardFound = this.findSpcialCardWithSameColor(plus2Cards, numOfPlayers, deck, players[0]);
                if (goodCardFound) {
                    plus2 += 2;
                    this.checkPlayerWin(players[0], 1, numOfPlayers, deck);
                }
            }
        }
        if (!goodCardFound) {
            if (plus2 > 0) { //there is an active 2plus card and the rival has no 2plus cards
                let numOfCardsPlayerHasToTake = plus2;
                for (let i = 0; i < numOfCardsPlayerHasToTake; i++) {
                    this.addCardToPlayersArr(players[0].cards, deck);
                }
                //this.checkPlayerWin(players[0], 1, numOfPlayers, deck);
            }
            else { // no 2plus cards on deck or in rivalArr
                if (!goodCardFound) {
                    let changeColorCards = this.getCardsFromRivalArrbByValue(players[0].cards, "change_colorful");

                    if (changeColorCards.length > 0) //change color exists
                    {
                        this.playWithColorChangeCard(players[0], changeColorCards[0], deck, numOfPlayers);
                    }
                    else //change color doesn't exist
                    {
                        let stopCards = this.getCardsFromRivalArrbByValue(players[0].cards, "stop");
                        if (stopCards.length > 0) {
                            goodCardFound = this.findSpcialCardWithSameColor(stopCards, numOfPlayers, deck, players[0]);
                        }
                        if (!goodCardFound) // stop with the same color wasn't found
                        {
                            var plusCards = this.getCardsFromRivalArrbByValue(players[0].cards, "plus");
                            if (plusCards.length > 0) {
                                goodCardFound = this.findSpcialCardWithSameColor(plusCards, numOfPlayers, deck, players[0]);
                            }
                            if (!goodCardFound) // plus with the same color wasn't found
                            {
                                let superTaki = this.getCardsFromRivalArrbByValue(players[0].cards, "taki_colorful");
                                if (superTaki.length > 0) {
                                    goodCardFound = true;
                                    let cardOnTopColor = cardOnTop.color;
                                    this.removeAndSetTopCard(players[0], superTaki[0], deck);
                                    cardOnTop.color = cardOnTopColor;
                                    cardOnTop.value = "taki";
                                    cardOnTop.imgSourceFront = this.getCardSource("taki", cardOnTop.color);
                                    setTimeout(() => { setStateInBoardCB('cardOntop', cardOnTop); }, 2000);
                                    this.rivalActionForTakiCard(players[0], numOfPlayers, deck);
                                }
                                if (!goodCardFound) {  // super taki wasn't found
                                    let takiCards = this.getCardsFromRivalArrbByValue(players[0].cards, "taki");
                                    if (takiCards.length > 0) {
                                        goodCardFound = this.findSpcialCardWithSameColor(takiCards, numOfPlayers, deck, players[0]);
                                    }
                                    if (!goodCardFound) { // taki wasn't found
                                        let sameColorCards = this.getCardsFromRivalArrbByColor(players[0].cards, cardOnTop.color);
                                        if (sameColorCards.length > 0) //a number with the same color exists
                                        {
                                            this.removeAndSetTopCard(players[0], sameColorCards[0], deck);
                                            goodCardFound = true;
                                            this.checkPlayerWin(players[0], this.checkTopCard(), numOfPlayers, deck);
                                        }
                                        if (!goodCardFound) //a number with the same color doesn't exist
                                        {
                                            let sameValuecards = this.getCardsFromRivalArrbByValue(players[0].cards, cardOnTop.value);
                                            if (sameValuecards.length > 0) //the same number exists
                                            {
                                                this.removeAndSetTopCard(players[0], sameValuecards[0], deck);
                                                isSpecialCard(players[0], numOfPlayers, deck, cardOnTop.color);
                                                goodCardFound = true;
                                            }
                                            else //the same number doesn't exist
                                            {
                                                this.addCardToPlayersArr(players[0].cards, deck);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}

function findSpcialCardWithSameColor(cards, numOfPlayers, deck, player) {
    let goodCardFound = false;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].color === cardOnTop.color) {
            this.removeAndSetTopCard(player, cards[i], deck);
            if (cards[i].value === "stop") {
                this.checkPlayerWin(player, 2, numOfPlayers, deck);
            }
            else if (cards[i].value === "plus") {
                this.changeTurn(numOfPlayers, numOfPlayers, deck);
            }
            else if (cards[i].value === "taki") {
                this.rivalActionForTakiCard(player, numOfPlayers, deck);
            }
            goodCardFound = true;
            break;
        }
    }
    return goodCardFound;
}

function getCardsFromRivalArrbByValue(playerCards, value) {
    let cards = [];
    for (let key in playerCards) {
        if (playerCards[key].value === value) {
            cards.push(playerCards[key]);
        }
    }
    return cards;
}

function getCardsFromRivalArrbByColor(playerCards, color) {
    let cards = [];
    for (let key in playerCards) {
        if (playerCards[key].color === color) {
            cards.push(playerCards[key]);
        }
    }
    return cards;
}

function playWithColorChangeCard(player, card, deck, numOfPlayers) {
    this.removeAndSetTopCard(player, card, deck); //send right parameters!
    let color = this.chooseColor(player);
    cardOnTop.color = color;
    cardOnTop.imgSourceFront = `cards/change_colorful_${color}.png`;
    setTimeout(() => { this.setColorToTopCard(color, deck); }, 1000);
    setTimeout(() => { setStateInBoardCB('changeColorWindowIsOpen', false, false); }, (2000));
    setTimeout(() => { this.checkPlayerWin(player, 1, numOfPlayers, deck); }, 2000);

    //setTimeout(function () { changeOpenDeckColor(color); }, 1000);
    //setTimeout(function () { this.checkPlayerWin(1); }, 1000);
}

function chooseColor(player) {
    let colorsArr = this.setColorsArr(player);
    let color = this.getColorFromColorsArr(colorsArr);
    return cardColors[color];
}

function setColorsArr(player) {
    var resArr = [0, 0, 0, 0];
    for (let i = 0; i < player.cards.length; i++) {
        if (player.cards[i].color !== null) {
            switch (player.cards[i].color) {
                case "blue":
                    resArr[0]++;
                    break;
                case "red":
                    resArr[1]++;
                    break;
                case "green":
                    resArr[2]++;
                    break;
                case "yellow":
                    resArr[3]++;
                    break;

            }
        }
    }
    return resArr;
}

function getColorFromColorsArr(colorsArr) {
    let max = 0;
    let indexOfMaxNum = 0;
    let res;

    for (let i = 0; i < colorsArr.length; i++) {
        if (colorsArr[i] > max) {
            max = colorsArr[i];
            indexOfMaxNum = i;
        }
    }
    res = indexOfMaxNum;
    return res;
}

// function colorChangedInWindow(color, deck, player, numOfPlayers) {
//     this.setColorToTopCard(color, deck);
//     setStateInBoardCB('changeColorWindowIsOpen', false, false);
//     // this.setState({
//     //     modalIsOpen: false 
//     // });
//     this.checkPlayerWin(player, 1, numOfPlayers, deck);
// }


function imDoneButtonClicked(gameData) {
    gameData.players[gameData.turnIndex].ImDoneIsHidden = true;
    gameData.openTaki = false;
    //setStateInBoardCB('ImDoneIsHidden', true, false);
    if (gameData.cardOnTop.value === "2plus") {
        gameData.plus2 += 2;
    }
    checkPlayerWin(gameData.players[gameData.turnIndex], checkTopCard(gameData), gameData);
}

function rotateArrow() {
    let newTransformAroow = transformArrow + 180;

    if (newTransformAroow >= 360) {
        newTransformAroow = newTransformAroow - 360;
    }
    transformArrow = newTransformAroow;
    setStateInBoardCB('transformArrow', newTransformAroow, false);
    //console.log("rotating");
}

function resizeCards() {
    let cardWidth = 120;
    let cardSpace = 70;
    let resizeArr = [0, 0];
    let cardMarginLeft = [0, 0];

    for (let i = 0; i < 2; i++) {
        if (gameStarted) {
            checkSpacesBetweenCards(resizeArr, i);
        }
        cardMarginLeft[i] = -(cardWidth - cardSpace - resizeArr[i]);
    }
    setStateInBoardCB('cardMarginLeft', cardMarginLeft, false);
}

function checkSpacesBetweenCards(resizeArr, index) {
    if (players[index].cards.length > 21) {
        resizeArr[index] -= 40;
    }
    else if (players[index].cards.length > 17) {
        resizeArr[index] -= 35;
    }
    else if (players[index].cards.length > 14) {
        resizeArr[index] -= 30;
    }
    else if (players[index].cards.length > 11) {
        resizeArr[index] -= 25;
    }
    else if (players[index].cards.length > 8) {
        resizeArr[index] -= 12;
    }
    else if (players[index].cards.length < 5) {
        resizeArr[index] += 25;
    }
}

module.exports = {
    createDeck, shareCardsToPlayers, drawOpeningCard,
    checkStatusOnTableDeckClicked, checkCard, setColorToTopCard, imDoneButtonClicked, gameTimer
}