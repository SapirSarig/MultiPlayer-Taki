import React, { Component } from 'react';
import CardComponent from './CardComponent.jsx';

class PlayerComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user, player, checkCard } = this.props;
        let {cardMarginLeft} = this.props;

        return (
            <div className={"player" + player.name} >
                <div>{player.name}</div>
                <div className="playerCardsContainer">
                    {player.cards.map(card => (
                        <CardComponent key={card.cardId} checkCard={checkCard} playerIndex={player.index} card={card} isOpenCard={player.name === user.name} isInDeck={false} cardMarginLeft={cardMarginLeft} />
                    ))}
                </div>
            </div>
        );
    }
}
export default PlayerComponent;
