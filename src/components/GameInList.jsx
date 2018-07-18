import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js';
import WaitingForGameScreen from './WaitingForGameScreen.jsx';

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
        console.log("****updateSingleGame****")
        gameToUpdate.numOfRegisterd++;
        this.setState({userJoined:true});
        this.props.updateUserInGame(true,gameToUpdate);
        if (gameToUpdate.numOfRegisterd.toString() === gameToUpdate.numOfPlayers) {
            gameToUpdate.Active = true;
        }
        fetch('/games/updateGameData', { method: 'POST', body: JSON.stringify(gameToUpdate), credentials: 'include' });
    }

    removeCurrGame(gameToRemove) {
        console.log("****removeing current game*******")
        fetch('/games/removeGame', { method: 'POST', body: JSON.stringify(gameToRemove), credentials: 'include' });
    }

    render() {
        const { currGame, userName,updateUserInGame} = this.props;
        const {userJoined} = this.state;
        let activeGameStyle = currGame.Active ? { border: 'solid green' } : { border: 'solid red' }
        let userCanRemove = currGame.userName === userName;
        let noOneRegisterd = currGame.numOfRegisterd === 0;

        return (
            <div className="gameInfo">
                <div className={"game_" + currGame.id} style={activeGameStyle}>
                    <div>
                        Game's Name: {currGame.name}
                    </div>
                    <div>
                        Number Of Players: {currGame.numOfPlayers}
                    </div>
                    <div>
                        Number Of Registerd: {currGame.numOfRegisterd}
                    </div>
                    <div>
                        Game's Status: {currGame.Active ? "Game Started" : "Game didn't start"}
                    </div>
                    <button className="joinGameBtn" hidden={currGame.Active} onClick={() => this.updateCurrGame(currGame)}>Join Game</button>
                    <button hidden={!(userCanRemove && noOneRegisterd)} className="RemoveGame" onClick={() => this.removeCurrGame(currGame)}> Remove Game </button>
                </div>
            </div>
        );
    }
}