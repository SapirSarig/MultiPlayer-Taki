import React, { Component } from 'react';
import CardComponent from './CardComponent.jsx';

class PlayerComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user, player, checkCard ,gameData } = this.props;
        let { cardMarginLeft } = this.props;
        let isPlayerTurn = gameData.turnIndex === player.index ? { border: 'solid green' } : null;

        //fsdfsra
        return (
            <div className={"player" + player.name} >
                <div>{player.name}</div>
                <div className="playerCardsContainer" style = {isPlayerTurn}>
                    {player.cards.map(card => (
                        <CardComponent key={card.cardId} checkCard={checkCard} playerIndex={player.index} card={card} isOpenCard={player.name === user.name} isInDeck={false} cardMarginLeft={cardMarginLeft} />
                    ))}
                </div>
            </div>
        );
    }
}
export default PlayerComponent;
