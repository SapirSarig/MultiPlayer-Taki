import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js'

export default class GameInList extends React.Component {
    constructor(props) {
        super(props);
        this.updateCurrGame = this.updateCurrGame.bind(this);
    }

    updateCurrGame(gameToUpdate) {
        console.log("****updateSingleGame****")
        gameToUpdate.numOfRegisterd++;
        if(gameToUpdate.numOfRegisterd.toString() === gameToUpdate.numOfPlayers)
        {
            gameToUpdate.Active=true;
        }
        fetch('/games/updateGameData', { method: 'POST', body: JSON.stringify(gameToUpdate), credentials: 'include' })
    }

    render() {
        const { currGame } = this.props;
        let activeGameStyle = currGame.Active ? {border:'solid green'} : {border:'solid red'}
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
                    <button hidden={currGame.Active} onClick={()=>this.updateCurrGame(currGame)}>Join Game</button>
                </div>
            </div>
        );

    }
}