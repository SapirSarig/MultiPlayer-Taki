import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../server/auth.js'
import LoggedInUsersList from '../components/LoggedInUsersList.jsx'
import CreateNewGame from './CreateNewGame.jsx'

export default class Lobby extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            hideCreateNewGameForm:true
        }
        this.changeHiddenProperty = this.changeHiddenProperty.bind(this);
    }

    componentDidMount() { }

    changeHiddenProperty() {
        if (this.state.hiddeCreateNewGameForm) {
            this.setState({ hiddeCreateNewGameForm: false });
        }
        else
        {
            this.setState({ hiddeCreateNewGameForm: true });
        }
    }
    
    render() {
        const {hideCreateNewGameForm} = this.state;
        return (
            <div className="lobby">
                <div className="mainLobby">
                    <LoggedInUsersList />

                    <button onClick={this.changeHiddenProperty}> Create Game </button>
                </div>
                <CreateNewGame hidden = {hideCreateNewGameForm} changeHiddenProperty = {this.changeHiddenProperty}/>
            </div>
        );
    }
}