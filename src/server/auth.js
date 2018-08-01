const userList = {};

function userAuthentication(req, res, next) {
	if (userList[req.session.id] === undefined) {
		res.sendStatus(401);
	} else {
		next();
	}
}

function addUserToAuthList(req, res, next) {
	if (!req.body) {
		res.status(401).send('user name empty');
	}
	//ifhfi
	else if (userList[req.session.id] !== undefined) {
		res.status(403).send('user already exists');
	} else {
		for (sessionid in userList) {
			const name = userList[sessionid];
			if (name === req.body) {
				res.status(403).send('user name already exists');
				return;
			}
		}
		userList[req.session.id] = req.body;
		next();
	}
}

function removeUserFromAuthList(req, res, next) {
	if (userList[req.session.id] === undefined) {
		res.status(403).send('user does not exist');
	} else {
		delete userList[req.session.id];
		next();
	}
}

function getUserInfo(id) {
	return { name: userList[id] };
}

function gameAuthentication(req, res, next) {
	if (gamesList[req.body.name] === undefined) {
		res.sendStatus(401);
	} else {
		next();
	}
}

function addGameToAuthList(req, res, next) {
	const currentGame = gamesList.find(game => game.name === req.body.name);

	if (currentGame) {
		res.status(403).send('game name already exists');
		return;
	}
	next();
}

module.exports = { userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, gameAuthentication, addGameToAuthList, userList }
