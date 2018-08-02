import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js';
import GameRoom from './GameRoom.jsx';
import PlayerComponent from './PlayerComponent.jsx';
import TableDeck from './TableDeck.jsx';
import "../../src/style.css";
import Statistics from "../components/Statistics.jsx";
import ChatContainer from './chatContainer.jsx';
import ConverssionArea from './converssionArea.jsx';
import ChatInput from './chatInput.jsx';

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        //
        this.getCurrGameData = this.getCurrGameData.bind(this);
        this.checkStatusOnTableDeckClicked = this.checkStatusOnTableDeckClicked.bind(this);
        this.checkCard = this.checkCard.bind(this);
        this.colorChangedInWindow = this.colorChangedInWindow.bind(this);
        this.imDoneButtonClicked = this.imDoneButtonClicked.bind(this);
        this.updatePlayerWatcher = this.updatePlayerWatcher.bind(this);
        this.showStatistics = this.showStatistics.bind(this);
        this.quitTheGame = this.quitTheGame.bind(this);
        this.gameTimer = this.gameTimer.bind(this);
        //this.timeHandler = this.timeHandler.bind(this);
        this.resizeCards = this.resizeCards.bind(this);
        this.showChat = this.showChat.bind(this);

        this.gameToCheck = {
            gameId: props.gameId,
            userName: props.user.name
        }

        this.state = {
            cardMarginLeft: [0, 0, 0, 0],
            gameData: {},
            showStatistics: false,
            isChatShown: false,
            gameStat:
                {
                    fullTime: "",
                    startTime: "00:01",
                    endTime: 0,
                    sec: 0,
                    min: 0,
                    stopTimer: false,
                    timeInterval: 0
                }
        }
    }

    componentDidMount() {
        this.getCurrGameData();
        this.gameTimer();
        this.resizeCards();
    }

    resizeCards() {
        const { gameId } = this.props;
        let { cardMarginLeft } = this.state;
        return fetch(`/games/getCardMarginLeftByGameId/?id=${gameId}`, { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then((cardMarginLeft) => cardMarginLeft && this.setState({ cardMarginLeft }))
            .catch(err => { throw err });
    }

    showChat(value) {
        this.setState({ isChatShown: value });
    }

    gameTimer() {
        const { gameStat } = this.state;
        let handler = function () {
            if (!gameStat.stopTimer) {
                if (++gameStat.sec === 60) {
                    gameStat.sec = 0;
                    ++gameStat.min;
                }
                gameStat.fullTime = (gameStat.min < 10 ? "0" + gameStat.min : gameStat.min) + ":" + (gameStat.sec < 10 ? "0" + gameStat.sec : gameStat.sec);
                //  setStateInBoardCB("timer", fullTime, fullTime === "00:02");
            }
            else {
                clearInterval(gameStat.timeInterval);
            }
        };

        gameStat.timeInterval = setInterval(handler, 1000);
        handler();

        this.setState({ gameStat });
    }

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
    }//

    checkStatusOnTableDeckClicked() {
        fetch('/games/checkStatusOnTableDeckClicked', { method: 'POST', body: JSON.stringify(this.gameToCheck), credentials: 'include' });
    }

    checkCard(cardToCheck) {
        const data = {
            gameToCheck: this.gameToCheck,
            card: cardToCheck,
        }
        fetch('/games/checkCard', { method: 'POST', body: JSON.stringify(data), credentials: 'include' });
        this.resizeCards();
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

    quitTheGame(value) {
        clearTimeout(this.timeoutId);
        fetch('/games/updateActivePlayers', { method: 'POST', body: JSON.stringify(this.gameToCheck), credentials: 'include' });
        this.props.quitTheGame(value, '');
    }

    render() {
        const { gameData, gameStat, showStatistics, cardMarginLeft, isChatShown } = this.state;
        const { user, gameId } = this.props;
        let myPlayer = {};
        let allPlayersWithOutMe = [];
        if (gameData.players) {
            myPlayer = gameData.players.find(player => player.name === user.name);
            allPlayersWithOutMe = gameData.players.filter(player => player.name !== user.name);
        }
        if (gameData.gameOver) {
            clearInterval(gameStat.timeInterval);
        }
        let timer = gameStat.fullTime;

        return (
            <div>
                {!gameData.gameOver && !isChatShown ?
                    <div>
                        {gameData && gameData.players && myPlayer && allPlayersWithOutMe && (
                            <div>


                                {allPlayersWithOutMe.map((player, index) => (
                                    player &&
                                    (<div key={index} className={`player${allPlayersWithOutMe.length === 1 ? index + 2 : index + 1}`}>
                                        <PlayerComponent hidden={player.noCardsLeft} user={user} checkCard={this.checkCard} player={player} numberOfPlayer={gameData.numberOfPlayer} gameData={gameData} index={index} cardMarginLeft={cardMarginLeft[player.index]} />
                                    </div>)
                                ))}
                                <div className="Statistics">
                                    {myPlayer.name === user.name && <Statistics showStatistics={this.showStatistics} gameData={gameData} quitTheGame={this.quitTheGame} user={user} gameStat={gameStat} timer={timer} />}
                                </div>
                                <TableDeck cardOnTop={gameData.cardOnTop} checkStatusOnTableDeckClicked={this.checkStatusOnTableDeckClicked} showChat={this.showChat} gameId={gameId} />
                                <div className={`myPlayer`}>
                                    {(myPlayer.name === user.name && !myPlayer.ImDoneIsHidden) && <button className="btn" onClick={() => this.imDoneButtonClicked()}>I'm done</button>}
                                    <PlayerComponent hidden={myPlayer.noCardsLeft} user={user} checkCard={this.checkCard} player={myPlayer} numberOfPlayer={gameData.numberOfPlayer} gameData={gameData} cardMarginLeft={cardMarginLeft[myPlayer.index]} />
                                </div>
                                {(myPlayer.name === user.name && myPlayer.changeColorWindowIsOpen) && <div className="colorWindowContainer">
                                    <div className="colorWindow">
                                        <button className="blue" onClick={() => this.colorChangedInWindow("blue")}></button>
                                        <button className="red" onClick={() => this.colorChangedInWindow("red")}></button>
                                        <button className="yellow" onClick={() => this.colorChangedInWindow("yellow")}></button>
                                        <button className="green" onClick={() => this.colorChangedInWindow("green")}></button>
                                    </div>
                                </div>}
                                {myPlayer.name === user.name && (myPlayer.noCardsLeft && !myPlayer.watcher) && (gameData.playersWithCards > 1) && <div className="WatcherChoiceContainer">
                                    <div className="watcherChoice">
                                        <button className="btn" onClick={() => this.updatePlayerWatcher()}>Stay And Watch</button>
                                        <button className="btn" onClick={() => this.quitTheGame(false, '')}>Back To Lobby</button>
                                    </div>
                                </div>}
                            </div>
                        )}
                    </div> :
                    (!gameData.gameOver && isChatShown ?
                        (<div className="chat-base-container">
                            <div className="chat-contaier">
                                <ConverssionArea gameId={gameId} />
                                <ChatInput gameId={gameId} />
                                <button onClick={() => this.showChat(false)}> quit chat </button>
                            </div>
                        </div>) : <Statistics showStatistics={this.showStatistics} quitTheGame={this.quitTheGame} gameData={gameData} user={user} gameStat={gameStat} timer={timer} />)}
            </div>
        );
    }
}