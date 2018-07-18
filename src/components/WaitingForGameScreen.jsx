import React from 'react';
import ReactDOM from 'react-dom';

export default class WaitingForGameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.updateCurrGameData = this.updateCurrGameData.bind(this);
        this.updateUserQuitGame = this.updateUserQuitGame.bind(this);
    }

    updateUserQuitGame(){
        const {user} = this.props;
        const gameToUpdate = user.usersGame;
        console.log("BEFORE Quit the game: " + gameToUpdate);
        console.log("BEFORE numOfRegisterd--")
        gameToUpdate.numOfRegisterd--;
        console.log("AFTER numOfRegisterd--")
        fetch('/games/updateGameData', { method: 'POST', body: JSON.stringify(gameToUpdate), credentials: 'include' });
        this.props.updateUserInGame(false, '');
    }

    updateCurrGameData()
    {
        const {user} = this.props;

        fetch(`/games/getGameByName/gameName=?${user.usersGame.name}`, { method: 'GET', credentials: 'include' })
        // .then((response) => {
        //     if (!response.ok) {
        //         throw response;
        //     }
        //     this.timeoutId = setTimeout(this.updateCurrGameData, 1000);
        //     return response.json();
        // })
        // .then((games) => games && games.length >= 0 && this.setState({ games }))
        // .catch(err => { throw err });

    }

    render() {
        const {user} = this.props;
        let hiddeQuitBtn = user.usersGame.Active;

        //this.updateCurrGameData();

        console.log("hidde btn? " + hiddeQuitBtn);
        console.log("user= " +user);
        return (
            <div className="WaitingScreen">
                <button hidden={hiddeQuitBtn} onClick={() => this.updateUserQuitGame()}>
                    Quit Game</button>
            </div>
        )
    }
}