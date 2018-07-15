import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js'
import GameInList from './GameInList.jsx';

export default class GamesList extends React.Component {
    constructor(props) {
        super(props);
        this.getGameListContent = this.getGameListContent.bind(this);
        this.state = {
            games: []
        }
    }

    componentDidMount() {
        this.getGameListContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getGameListContent() {
        console.log("getGameListContent")
        return fetch('/games/allGames', { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getGameListContent, 1000);
                return response.json();
            })
            .then((games) => games && games.length > 0 && this.setState({ games }))
            .catch(err => { throw err });
    }

    render() {
        const { games } = this.state;
        return (

            <div className="gameList">
                {games.map(currGame => (
                    <GameInList key={currGame.id} currGame={currGame} />)
                )}
                {/* {games.map(({ name }, index) =>
                    (
                        <div key={index}>
                            <div>{name}</div>
                        </div>
                    )
                )} */}
            </div>
        );
    }
}