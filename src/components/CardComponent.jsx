import React, { Component } from 'react';
import  "../../src/style.css";

class CardComponent extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { card, checkCard, playerIndex, isOpenCard, isInDeck, checkStatusOnTableDeckClicked } = this.props;
        let { cardMarginLeft } = this.props;
        return (
            <div>
                {card && <div style={!isInDeck ? { marginLeft: cardMarginLeft } : null}>
                    {isOpenCard ? <img className="card" alt="card" src={card.imgSourceFront} onClick={isInDeck ? null : () => checkCard(card)} />
                        : <img src={card.imgSourceBack} alt="card" className="card" onClick={isInDeck ? () => checkStatusOnTableDeckClicked() : null}  />}

                </div>}
            </div>
        );
    }
}

export default CardComponent;