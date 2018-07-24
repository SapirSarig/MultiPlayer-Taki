const express = require('express');
const router = express.Router();
const auth = require('./auth');

const GameLogic = require('./GameLogic.js');


const gamesList = [];
let gameId = 1;
const gamesManagement = express.Router();

gamesManagement.get('/allGames', auth.userAuthentication, (req, res) => {
    res.json(gamesList);
});

gamesManagement.get('/getGameById', (req, res) => {
    const id = req.query.id;
    const currentGame = gamesList.find(game => game.id === Number(id));
    res.json(currentGame);
});

gamesManagement.post('/addGame', auth.userAuthentication, (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const currentGame = gamesList.find(game => game.name === bodyObj.name);

    if (currentGame) {
        res.status(403).send('game name already exists');
        return;
    }

    bodyObj.id = gameId;
    gameId++;
    gamesList.push(bodyObj);
    res.sendStatus(201);
});

gamesManagement.post('/updateGameData', (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const gameIndex = gamesList.findIndex(game => game.name === bodyObj.name);

    //console.log("BEFORE updating " + gamesList[gameIndex].numOfRegisterd)
    gamesList[gameIndex] = bodyObj;
    //console.log("AFTER updating " + gamesList[gameIndex].numOfRegisterd)
    res.sendStatus(201);
});

gamesManagement.post('/removeGame', (req, res) => {
    const gameIndex = findGameIndex(req);
    //console.log(gamesList[gameIndex]);
    //console.log("num of games BEFORE: " + gamesList.length);
    gamesList.splice(gameIndex, 1);
    //console.log("num of games AFTER: " + gamesList.length);
    res.sendStatus(201);
});

function findGameIndex(req) {
    const bodyObj = JSON.parse(req.body);
    return gamesList.findIndex(game => game.name === bodyObj.name);
}

gamesManagement.get('/getGameDataById', (req, res) => {
    const id = req.query.id;
    const currentGame = gamesList.find(game => game.id === Number(id));
    res.json(currentGame.gameData);
});

gamesManagement.get('/createGame', (req, res) => {
    const id = req.query.id;
    const currentGame = gamesList.find(game => game.id === Number(id));
    createGame(currentGame);
    res.sendStatus(201);
});

gamesManagement.post('/checkCard', (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const currentGame = findCurrGame(bodyObj.gameToCheck);
    const userName = bodyObj.gameToCheck.userName;
    GameLogic.checkCard(bodyObj.card, userName, currentGame.gameData);
    res.sendStatus(200);

});

function findCurrGame(bodyObj) {
    const gameId = bodyObj.gameId;
    return gamesList.find(game => game.id === Number(gameId));
}

gamesManagement.post('/checkStatusOnTableDeckClicked', (req, res) => {
    const bodyObj = JSON.parse(req.body);
    const currentGame = findCurrGame(bodyObj);
    const userName = bodyObj.userName;

    // const {gameData} = this.state;
    // const { user } = this.props;

    // // { players, deck, cardOnTop } = this.state;
    GameLogic.checkStatusOnTableDeckClicked(userName, currentGame.gameData);
    //console.log(currentGame, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    res.sendStatus(200);

    // this.setState(() => {
    //     return {
    //         deck
    //     };
    // });
});

function createGame(currentGame) {
    currentGame.gameData.takenCardsCounter = 0;
    currentGame.gameData.numOfPlayers = currentGame.numOfPlayers;
    currentGame.gameData.numOfTurns = 0
    currentGame.gameData.turnIndex = 0;
    currentGame.gameData.plus2 = 0;
    currentGame.gameData.gameStarted = false;
    currentGame.gameData.openTaki = false;
    currentGame.gameData.cardOnTop = null;
    currentGame.gameData.gameOver = false;
    currentGame.gameData.deck = GameLogic.createDeck();
    currentGame.gameData.players = GameLogic.shareCardsToPlayers(currentGame.numOfRegisterd, currentGame.gameData);
    currentGame.gameData.cardOnTop = GameLogic.drawOpeningCard(currentGame.gameData);
    //console.log(currentGame.gameData + "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
}



module.exports = gamesManagement;