import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../server/auth.js'
import LoggedInUsersList from '../components/LoggedInUsersList.jsx';
import CreateNewGame from './CreateNewGame.jsx';
import GamesList from './GamesList.jsx';

export default class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hideCreateNewGameForm: true
        }
        this.changeHiddenProperty = this.changeHiddenProperty.bind(this);
    }

    componentDidMount() { }

    changeHiddenProperty() {
        if (this.state.hideCreateNewGameForm) {
            this.setState(()=>{return{ hideCreateNewGameForm: false }});
        }
        else {
            this.setState(()=>{return{ hideCreateNewGameForm: true }});
        }
        console.log(this.state.hidden);
    }

    render() {
        const { hideCreateNewGameForm } = this.state;
        return (
            <div className="lobby">
                <div className="mainLobby" hidden={!hideCreateNewGameForm}>
                    <LoggedInUsersList />
                    <button onClick={()=>this.changeHiddenProperty()}> Create Game </button>
                    <GamesList/>
                </div>
                <div className="createNewGame" hidden={hideCreateNewGameForm}>
                    <CreateNewGame changeHiddenProperty={this.changeHiddenProperty}  />
                </div>
            </div>
        );
    }
}