import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js';
import GameRoom from './GameRoom.jsx';
import PlayerComponent from './PlayerComponent.jsx';
import TableDeck from './TableDeck.jsx';

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        this.getCurrGameData = this.getCurrGameData.bind(this);
        this.createGameData = this.createGameData.bind(this);
        this.checkStatusOnTableDeckClicked = this.checkStatusOnTableDeckClicked.bind(this);
        this.checkCard = this.checkCard.bind(this);
        this.gameToCheck = {
            gameId: props.gameId,
            userName: props.user.name
        }

        this.state = {
            gameData: {},
            // ImDoneIsHidden: true,
            // changeColorWindowIsOpen: false
        }
    }

    componentDidMount() {
        this.createGameData().then(() => this.getCurrGameData()).catch(() => alert("ERROR"));
    }

    createGameData() {
        return fetch(`/games/createGame/?id=${this.props.gameId}`, { method: 'GET', credentials: 'include' })
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
            //.then((gameData) => console.log(gameData))
            .then((gameData) => gameData && this.setState({ gameData }))
            .catch(err => { throw err });
    }

    checkStatusOnTableDeckClicked() {
        // const { gameId, user } = this.props;
        // const gameToCheck = {
        //     gameId: gameId,
        //     userName: user.name
        // }
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

    render() {
        const { gameData } = this.state;
        const { user } = this.props;
        return (
            <div>
                {gameData && gameData.players && (
                    <div>
                        <TableDeck cardOnTop={gameData.cardOnTop} checkStatusOnTableDeckClicked={this.checkStatusOnTableDeckClicked} />
                        <div>End of deck</div>
                        {gameData.players.map((player, index) => (
                                player &&   
                                (<div key={index}>
                                    {(player.name === user.name && player.changeColorWindowIsOpen) && <div className="colorWindowContainer">
                                        <div className="colorWindow">
                                            <button className="blue" onClick={() => this.colorChangedInWindow("blue")}></button>
                                            <button className="red" onClick={() => this.colorChangedInWindow("red")}></button>
                                            <button className="yellow" onClick={() => this.colorChangedInWindow("yellow")}></button>
                                            <button className="green" onClick={() => this.colorChangedInWindow("green")}></button>
                                        </div>
                                    </div>}
                                    {(player.name === user.name && !player.ImDoneIsHidden) && <button className="ImDoneButton" /*onClick={() => GameLogic.onImDoneButtonClicked(players[numberOfPlayer - 1], numberOfPlayer, deck)}*/>I'm done</button>}
                                    <PlayerComponent user={user} checkCard={this.checkCard} player={player} numberOfPlayer={gameData.numberOfPlayer} /*cardMarginLeft={cardMarginLeft[1]}*/ />
                                </div>)
                            )
                        )}
                    </div>
                )}
            </div>
        );
    }
}