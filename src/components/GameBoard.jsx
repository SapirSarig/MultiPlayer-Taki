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
            gameId: this.props.gameId,
            userName: this.props.user.name
        }

        this.state = {
            gameData: {}
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
            card:cardToCheck
        }
        fetch('/games/checkCard', { method: 'POST', body: JSON.stringify(data), credentials: 'include' });
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
                        {gameData.players[0] && <PlayerComponent user={user} checkCard={this.checkCard} player={gameData.players[0]} numberOfPlayer={gameData.numberOfPlayer} /*cardMarginLeft={cardMarginLeft[1]}*/ />}
                        {gameData.players[1] && <PlayerComponent user={user} checkCard={this.checkCard} player={gameData.players[1]} numberOfPlayer={gameData.numberOfPlayer} /*cardMarginLeft={cardMarginLeft[1]}*/ />}
                        {gameData.players[2] && <PlayerComponent user={user} checkCard={this.checkCard} player={gameData.players[2]} numberOfPlayer={gameData.numberOfPlayer} /*cardMarginLeft={cardMarginLeft[1]}*/ />}
                        {gameData.players[3] && <PlayerComponent user={user} checkCard={this.checkCard} player={gameData.players[3]} numberOfPlayer={gameData.numberOfPlayer} /*cardMarginLeft={cardMarginLeft[1]}*/ />}
                    </div>)}
            </div>
        );
    }
}