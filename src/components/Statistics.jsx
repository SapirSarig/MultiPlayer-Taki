import React, { Component } from 'react';


class Statistics extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let { numOfTurns, players, timer, avgTimeForTurn, avgTimeForTurnPerGame, numOfCardsInDeck } = this.props;
        const { showStatistics, gameData, quitTheGame, user,gameStat } = this.props;
        return (
            <div className="Statistics">
                Statistics
                <div>Time: {gameStat.fullTime} </div>
                <div>Cards in deck: {gameData.deck.length - gameData.takenCardsCounter} </div>
                <div>Number of turns: {gameData.numOfTurns} </div>


                {gameData.players.map((player, index) => (
                    user.name === player.name && (
                        <div key={index}>
                            <div> {player.name} had one card: {player.oneCardLeftCounter} </div>
                            <div> {player.name} avg of turns time: {player.avg} </div>
                        </div>
                    )))}
                {!gameData.gameOver ? <button className="btn" onClick={() => showStatistics(false)}>Hide Statistics</button> :
                    <button className="btn" onClick={() => quitTheGame(false)}>Back To Lobby</button>}

            </div>
        );
    }
}

export default Statistics;