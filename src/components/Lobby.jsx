import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../server/auth.js'

export default class Lobby extends React.Component {
    constructor(args) {
        super(...args);

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        fetch('/users/allUsers', { method: 'GET', credentials: 'include' }).then(response => {
            if (response.ok) {
                response.json().then(value => {
                    this.setState({ users: value });
                });
            } else {

            }
        });
    }

    render() {
        const { users } = this.state;
        const currUser="";
        return (
            <div className ="userLisr">
                {Object.values(users).map((userName) => {
                    <div>{userName}</div>
                    console.log("from map: " + userName);
                })}
            </div>
        );
    }
}