const express = require('express');
const router = express.Router();
const auth = require('./auth');

const gamesList = [];

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

    gamesList.push(bodyObj);
    res.sendStatus(201);
});

module.exports = gamesManagement;