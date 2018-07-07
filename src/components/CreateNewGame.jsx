import React from 'react';
import ReactDOM from 'react-dom';

export default class CreateNewGame extends React.Component {
    constructor(args) {
        super(...args);

        this.state ={
        }
    }
    
    render() {
        return (
            <div className="CreateNewGame-wrapper" >
                <form onSubmit={this.HandleNewGame}>
                    <label className="nameOfGame-label" htmlFor="gamesname"> Game's name: </label>
                    <input className="nameOfGame-input" name="gamesname"/>     
                    <label className="nameOfPlayers-label" htmlFor="nameOfPlayers"> Number of players: </label><br/>
                    <input type ="radio" name="numOfPlayers-input" value="2" /> 2<br/>
                    <input type ="radio" name="numOfPlayers-input" value="3" /> 3 <br/>
                    <input type ="radio" name="numOfPlayers-input" value="4" /> 4 <br/>                
                    <input className="submit-btn btn" type="submit" value="Create"/>
                </form>
            </div>
        );
    }
   
}