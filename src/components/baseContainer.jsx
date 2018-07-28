import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import ChatContaier from './chatContainer.jsx';
import Lobby from './Lobby.jsx'
import GameRoom from './GameRoom.jsx';
import "../../src/style.css";

export default class BaseContainer extends React.Component {
    constructor(props) {
        super(...props);
        this.state = {
            showLogin: true,
            currentUser: {
                name: '',
                inGame: false,
                usersGame: {}
            }
        };

        this.updateUserInGame = this.updateUserInGame.bind(this);
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
    }

    render() {
        if (this.state.showLogin) {
            return (<LoginModal loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError} />)
        }
        return this.renderLobbyRoom();
        // return this.renderChatRoom();
    }


    handleSuccessedLogin() {
        this.setState(() => ({ showLogin: false }), this.getUserName);
    }

    handleLoginError() {
        console.error('login failed');
        this.setState(() => ({ showLogin: true }));
    }

    renderChatRoom() {
        return (
            <div className="chat-base-container">
                <div className="user-info-area">
                    Hello {this.state.currentUser.name}
                    <button className="logout btn" onClick={this.logoutHandler}>Logout</button>
                </div>
                <ChatContaier />
            </div>
        )
    }

    updateUserInGame(isInGame, game) {
        const currUser = this.state.currentUser;
        currUser.inGame = isInGame;
        currUser.usersGame = game;
        this.setState({ currentUser: currUser });
    }

    renderLobbyRoom() {
        const { currentUser } = this.state;
        if (currentUser.inGame) {
            return (<GameRoom user={currentUser} updateUserInGame={this.updateUserInGame} />)
        }
        return (
            <div className="lobby-base-container">
                <div className="user-info-area">
                    Hello {currentUser.name}
                    <button className="logout btn" onClick={this.logoutHandler}>Logout</button>
                </div>
                <Lobby userName={currentUser.name} updateUserInGame={this.updateUserInGame} />
            </div>
        )
    }

    getUserName() {
        this.fetchUserInfo()
            .then(userInfo => {
                this.setState(() => ({ currentUser: userInfo, showLogin: false }));
            })
            .catch(err => {
                if (err.status === 401) { // incase we're getting 'unautorithed' as response
                    this.setState(() => ({ showLogin: true }));
                } else {
                    throw err; // in case we're getting an error
                }
            });
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

    logoutHandler() {
        fetch('/users/logout', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    console.log(`failed to logout user ${this.state.currentUser.name} `, response);
                }
                this.setState(() => ({ currentUser: { name: '' }, showLogin: true }));
            })
    }
}