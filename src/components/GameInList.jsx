import React from 'react';
import ReactDOM from 'react-dom';
import { gamesList } from '../server/auth.js'

export default class GameInList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { currGame } = this.props;
        return (
            <div className="gameInfo">
                <div className={"game_" + currGame.id}>
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
                    <button>Join Game</button>
                </div>
            </div>
        );

    }
}