import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../server/auth.js'
import LoggedInUsersList from '../components/LoggedInUsersList.jsx'

export default class Lobby extends React.Component {
    constructor(args) {
        super(...args);
    }

    componentDidMount() {}

    render() {
        return (
            <LoggedInUsersList/>
        );
    }
}