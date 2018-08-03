import React from 'react';
import ReactDOM from 'react-dom';

export default class ChatInput extends React.Component {
    constructor(props) {
        super(...props);        

        this.state = {
            sendInProgress:false
        };

        this.sendText = this.sendText.bind(this);
    }

    render() {               
        return(
            <form className="chat-input-wrapper" onSubmit={this.sendText}>
                <input disabled={this.state.sendInProgress} placeholder="enter text here" ref={input => this.inputElement = input} />
                <input type="submit" className="btn" disabled={this.state.sendInProgress} value="Send" />
            </form>
        )
    }   
//
    sendText(e) {
        e.preventDefault();
        this.setState(()=>({sendInProgress: true}));
        const inputText = this.inputElement.value;
        const input = {
            text: inputText,
            gameId: this.props.gameId
        }

        fetch('/games/setInputInChat', {
            method: 'POST',
            body: JSON.stringify(input),
            credentials: 'include'
        })
        .then(response => {            
            if (!response.ok) {                
                throw response;
            }
            this.setState(()=>({sendInProgress: false}));
            this.inputElement.value = '';                
        });
        return false;
    }
}