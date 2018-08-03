import React, { Component } from 'react';


class Statistics extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { numOfTurns, players, avgTimeForTurn, avgTimeForTurnPerGame, numOfCardsInDeck } = this.props;
        const { showStatistics, gameData, quitTheGame, user, gameStat, timer } = this.props;
        const showStatisticBtn = true;
        return (
            <div>
                
                Statistics
                <div>Time: {timer} </div>
                <div>Cards in deck: {gameData.deck.length - gameData.takenCardsCounter} </div>
                <div>Number of turns: {gameData.numOfTurns} </div>

                {gameData.players.map((player, index) =>
                    (!gameData.gameOver ?
                        user.name === player.name && (
                            <div key={index}>
                                <div> {player.name} had one card: {player.oneCardLeftCounter} </div>
                                <div> {player.name} avg of turns time: {player.avg} </div>
                            </div>
                        ) :
                        <div key={index}>
                            <div> {player.name} had one card: {player.oneCardLeftCounter} </div>
                            <div> {player.name} avg of turns time: {player.avg} </div>
                        </div>
                    ))}
                {gameData.gameOver &&
                    <button className="btn" onClick={() => quitTheGame(false)}>Back To Lobby</button>}

            </div>
        );
    }
}

export default Statistics;