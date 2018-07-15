import React from 'react';
import ReactDOM from 'react-dom';
import baseContainer from './baseContainer.jsx'

let gameId = 1;

export default class CreateNewGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currGame: {
                name: "",
                id:0,
                userName: "",
                numOfPlayers: 0,
                numOfRegisterd: 0,
                Active: false
            },

            errMessage: ""

        }
        this.handleCreateGame = this.handleCreateGame.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNumChange = this.handleNumChange.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);

    }

    handleCreateGame(e) {
        const { changeHiddenProperty } = this.props;
        const game = this.state.currGame;
        game.id = gameId;
        gameId++;
        this.setState({ currGame: game });
        const { currGame } = this.state;

        e.preventDefault();
        this.fetchUserInfo().then(userName => {
            currGame.userName = userName && userName.name ? userName.name : '';
            fetch('/games/addGame', { method: 'POST', body: JSON.stringify(currGame), credentials: 'include' })
                .then(response => {
                    if (response.ok) {
                        this.setState(() => ({ errMessage: "" }));
                        changeHiddenProperty();
                    } else {
                        if (response.status === 403) {
                            console.log("game is already exist!!!!")
                            this.setState(() => ({ errMessage: "Game name already exists, please try another one" }));
                        }
                    }
                });
        });

        return false;

    }

    handleNameChange(event) {
        const game = this.state.currGame;
        game.name = event.target.value;
        this.setState({ currGame: game });
    }

    handleNumChange(event) {
        const game = this.state.currGame;
        game.numOfPlayers = event.target.value;
        this.setState({ currGame: game });
    }

    fetchUserInfo() {
        return fetch('/users', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }

    
    renderErrorMessage() {
        if (this.state.errMessage) {
            return (
                <div className="newGame-error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

    render() {
        return (
            <div className="CreateNewGame-wrapper" >
                <label className="nameOfGame-label" htmlFor="gamesname"> Game's name: </label>
                <input className="nameOfGame-input" name="gamesname" onChange={this.handleNameChange} />     <br />
                <label className="nameOfPlayers-label" htmlFor="nameOfPlayers"> Number of players: </label><br />
                <input type="radio" name="numOfPlayers-input" value="2" onChange={this.handleNumChange} /> 2<br />
                <input type="radio" name="numOfPlayers-input" value="3" onChange={this.handleNumChange} /> 3 <br />
                <input type="radio" name="numOfPlayers-input" value="4" onChange={this.handleNumChange} /> 4 <br />
                <input onClick={this.handleCreateGame} className="submit-btn btn" type="submit" value="Create" />
                {this.renderErrorMessage()}
            </div>
        );
    }

}