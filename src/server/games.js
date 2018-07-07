const express = require('express');
const router = express.Router();
const auth = require('./auth');

const gamesList = [];

const gamesManagement = express.Router();

// games.get('/', auth.gameAuthentication, (req, res) => {
// 	const game = auth.getGameInfo(req.session.id).name;
// 	res.json({name:userName});
// });

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

// games.get('/removeGame', [
// 	(req, res, next) => {	
// 		const userinfo = auth.getUserInfo(req.session.id);	
// 		chatManagement.appendUserLogoutMessage(userinfo);
// 		next();
// 	}, 
// 	auth.removeUserFromAuthList, 
// 	(req, res) => {
// 		res.sendStatus(200);		
// 	}]
// );

module.exports = gamesManagement;