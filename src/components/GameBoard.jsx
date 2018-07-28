import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js';
import GameRoom from './GameRoom.jsx';
import PlayerComponent from './PlayerComponent.jsx';
import TableDeck from './TableDeck.jsx';
import "../../src/style.css";
import Statistics from "../components/Statistics.jsx";

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        this.getCurrGameData = this.getCurrGameData.bind(this);
        //this.createGameData = this.createGameData.bind(this);
        this.checkStatusOnTableDeckClicked = this.checkStatusOnTableDeckClicked.bind(this);
        this.checkCard = this.checkCard.bind(this);
        this.colorChangedInWindow = this.colorChangedInWindow.bind(this);
        this.imDoneButtonClicked = this.imDoneButtonClicked.bind(this);
        this.updatePlayerWatcher = this.updatePlayerWatcher.bind(this);
        this.showStatistics = this.showStatistics.bind(this);
        this.quitTheGame = this.quitTheGame.bind(this);
        this.gameToCheck = {
            gameId: props.gameId,
            userName: props.user.name
        }
        //fdhgd

        this.state = {
            gameData: {},
            showStatistics: false
        }
    }

    componentDidMount() {
        //this.createGameData().then(() =>
        this.getCurrGameData();
        //.catch(() => alert("ERROR"));
    }

    // createGameData() {
    //     return fetch(`/games/createGame/?id=${this.props.gameId}`, { method: 'GET', credentials: 'include' })
    // }

    getCurrGameData() {
        const { gameId } = this.props;
        return fetch(`/games/getGameDataById/?id=${gameId}`, { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getCurrGameData, 200);
                return response.json();
            })
            .then((gameData) => gameData && this.setState({ gameData }))
            .catch(err => { throw err });
    }

    checkStatusOnTableDeckClicked() {
        fetch('/games/checkStatusOnTableDeckClicked', { method: 'POST', body: JSON.stringify(this.gameToCheck), credentials: 'include' });
    }

    checkCard(cardToCheck) {
        const data = {
            gameToCheck: this.gameToCheck,
            card: cardToCheck,
        }
        fetch('/games/checkCard', { method: 'POST', body: JSON.stringify(data), credentials: 'include' });
    }

    colorChangedInWindow(color) {
        const data = {
            gameToCheck: this.gameToCheck,
            color: color
        }
        fetch('/games/setColorToTopCard', { method: 'POST', body: JSON.stringify(data), credentials: 'include' })

    }

    imDoneButtonClicked() {
        fetch('/games/imDoneButtonClicked', { method: 'POST', body: JSON.stringify(this.gameToCheck), credentials: 'include' })
    }

    updatePlayerWatcher() {
        //bfdbggdfsgs
        fetch('/games/updatePlayerWatcher', { method: 'POST', body: JSON.stringify(this.gameToCheck), credentials: 'include' });
    }

    showStatistics(value) {
        this.setState({ showStatistics: value });
    }

    quitTheGame(value)
    {
        clearTimeout(this.timeoutId);
        fetch('/games/updateActivePlayers', { method: 'POST', body: JSON.stringify(this.gameToCheck), credentials: 'include' });
        this.props.quitTheGame(value,'');
    }

    render() {
        const { gameData } = this.state;
        const { user } = this.props;
        return (
            <div>
                {!gameData.gameOver ?
                    <div>
                        {gameData && gameData.players && (
                            <div>
                                <TableDeck cardOnTop={gameData.cardOnTop} checkStatusOnTableDeckClicked={this.checkStatusOnTableDeckClicked} />
                                <div>End of deck</div>
                                <button className="btn" onClick={() => this.showStatistics(true)}>Show Statistics </button>

                                {gameData.players.map((player, index) => (
                                    player &&
                                    (<div key={index}>
                                        {player.name === user.name && this.state.showStatistics && <Statistics showStatistics={this.showStatistics} gameData={gameData} quitTheGame={this.quitTheGame}/>}
                                        {(player.name === user.name && player.changeColorWindowIsOpen) && <div className="colorWindowContainer">
                                            <div className="colorWindow">
                                                <button className="blue" onClick={() => this.colorChangedInWindow("blue")}></button>
                                                <button className="red" onClick={() => this.colorChangedInWindow("red")}></button>
                                                <button className="yellow" onClick={() => this.colorChangedInWindow("yellow")}></button>
                                                <button className="green" onClick={() => this.colorChangedInWindow("green")}></button>
                                            </div>
                                        </div>}
                                        {(player.name === user.name && !player.ImDoneIsHidden) && <button className="ImDoneButton" onClick={() => this.imDoneButtonClicked()}>I'm done</button>}
                                        <PlayerComponent hidden={player.noCardsLeft} user={user} checkCard={this.checkCard} player={player} numberOfPlayer={gameData.numberOfPlayer} gameData={gameData} /*cardMarginLeft={cardMarginLeft[1]}*/ />
                                        {player.name === user.name && (player.noCardsLeft && !player.watcher) && (gameData.playersWithCards > 1) && <div className="WatcherChoiceContainer">
                                            <div className="watcherChoice">
                                                <button className="btn" onClick={() => this.updatePlayerWatcher()}>Stay And Watch</button>
                                                <button className="btn" onClick={() => this.quitTheGame(false, '')}>Back To Lobby</button>
                                            </div>
                                        </div>}
                                    </div>)
                                )
                                )}
                            </div>
                        )}
                    </div> :
                    <Statistics showStatistics={this.showStatistics} gameData={gameData} quitTheGame={this.quitTheGame}/>}
            </div>
        );
    }
}