import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js';
import GameRoom from './GameRoom.jsx';
import "../../src/style.css";

export default class GameInList extends React.Component {
    constructor(props) {
        super(props);
        this.updateCurrGame = this.updateCurrGame.bind(this);
        this.removeCurrGame = this.removeCurrGame.bind(this);
        this.state = {
            userJoined: false
        }
    }

    updateCurrGame(gameToUpdate) {
        //console.log("****updateSingleGame****")
        gameToUpdate.numOfRegisterd++;
        gameToUpdate.gameData.playersName.push(this.props.userName);
        this.setState({userJoined:true});
        this.props.updateUserInGame(true,gameToUpdate);
        if (Number(gameToUpdate.numOfRegisterd) === Number(gameToUpdate.numOfPlayers)) {
            //console.log("active GAme now! ")
            gameToUpdate.Active = true;
        }
        fetch('/games/updateGameData', { method: 'POST', body: JSON.stringify(gameToUpdate), credentials: 'include' });
        if(gameToUpdate.Active)
        {
            fetch(`/games/createGame/?id=${this.props.currGame.id}`, { method: 'GET', credentials: 'include' });
        }
    }

    removeCurrGame(gameToRemove) {
        //console.log("****removeing current game*******")
        fetch('/games/removeGame', { method: 'POST', body: JSON.stringify(gameToRemove), credentials: 'include' });
    }

    render() {
        const { currGame, userName,updateUserInGame} = this.props;
        const {userJoined} = this.state;
        let activeGameStyle = currGame.Active ? { border: 'solid blue' } : { border: 'solid red' }
        let userCanRemove = currGame.userName === userName;
        let noOneRegisterd = currGame.numOfRegisterd === 0;

        return (
            <div className="gameInfo">
                <div className={"game_" + currGame.id} style={activeGameStyle}>
                    <div className ="text">
                        Game's Owner: {currGame.userName}
                    </div>
                    <div className ="text">
                        Game's Name: {currGame.name}
                    </div>
                    <div className ="text">
                        Number Of Players: {currGame.numOfPlayers}
                    </div>
                    <div className ="text">
                        Number Of Registerd: {currGame.numOfRegisterd}
                    </div>
                    <div className ="text">
                        Game's Status: {currGame.Active ? "Game Started" : "Game didn't start"}
                    </div>
                    <button className="btn" hidden={currGame.Active} onClick={() => this.updateCurrGame(currGame)}>Join Game</button>
                    <button className="btn" hidden={!(userCanRemove && noOneRegisterd)} onClick={() => this.removeCurrGame(currGame)}> Remove Game </button>
                </div>
            </div>
        );
    }
}
//