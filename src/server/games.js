const express = require('express');
const router = express.Router();
const auth = require('./auth');

const gamesList = [];
let gameId = 1;
const gamesManagement = express.Router();

gamesManagement.get('/allGames', auth.userAuthentication, (req, res) => {
    res.json(gamesList);
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

    console.log("BEFORE updating " + gamesList[gameIndex].numOfRegisterd)
    gamesList[gameIndex] = bodyObj;
    console.log("AFTER updating " + gamesList[gameIndex].numOfRegisterd)
    res.sendStatus(201);
});

gamesManagement.post('/removeGame', (req,res) =>{
    const gameIndex = findGameIndex(req);
    console.log(gamesList[gameIndex]);
    console.log("num of games BEFORE: " +gamesList.length);
    gamesList.splice(gameIndex,1);    
    console.log("num of games AFTER: " +gamesList.length);
    res.sendStatus(201);
});

function findGameIndex(req){
    const bodyObj = JSON.parse(req.body);
    return gamesList.findIndex(game => game.name === bodyObj.name);
}

module.exports = gamesManagement;