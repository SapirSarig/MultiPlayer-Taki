import React, { Component } from 'react';


class Statistics extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let { numOfTurns, players, timer, avgTimeForTurn, avgTimeForTurnPerGame, numOfCardsInDeck } = this.props;
        const { showStatistics, gameData, quitTheGame } = this.props;
        return (
            <div className="Statistics">
                Statistics
                <div>Time: {gameData.gameStat.fullTime} </div>
                <div>Cards in deck: {gameData.deck.length - gameData.takenCardsCounter} </div>
                <div>Number of turns: {gameData.numOfTurns} </div>

                {gameData.players.map((player, index) => {
                    <div>
                        <div> {player.name} had one card: {player.oneCardLeftCounter} </div>
                        <div> {player.name} avg of turns time: {player.avg} </div>
                    </div>
                })}


                {/* <div className="leftData">
                    <div>Time: {timer}</div>
                    <div>Cards in deck: {numOfCardsInDeck} </div>
                    <div>Number of turns: {numOfTurns}</div>
                </div>
                <div className="rightData">
                    <div>Avg of turns time: {avgTimeForTurn}</div>
                    <div>Avg of turns time in all games: {avgTimeForTurnPerGame}</div>
                    <div>Player {players[0].index} had one card {players[0].oneCardLeftCounter} times </div>
                    <div>Player {players[1].index} had one card {players[1].oneCardLeftCounter} times </div>
                </div> */}
                {!gameData.gameOver ? <button className="btn" onClick={() => showStatistics(false)}>Hide Statistics</button> :
                    <button className="btn" onClick={() => quitTheGame(false)}>Back To Lobby</button>}

            </div>
        );
    }
}

export default Statistics;