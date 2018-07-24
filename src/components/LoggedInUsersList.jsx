import React from 'react';
import ReactDOM from 'react-dom';
import { userList } from '../server/auth.js'

export default class LoggedInUsersList extends React.Component {
    constructor(props) {
        super(props);
        this.getUserListContent = this.getUserListContent.bind(this);
        this.state = {
            users: {}
        }
    }

    componentDidMount() {
        this.getUserListContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getUserListContent() {
        //console.log("getUserListContent")
        return fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.timeoutId = setTimeout(this.getUserListContent, 200);
            return response.json();            
        })
        .then((users) => this.setState({users}))
        .catch(err => {throw err});
    }

    render() {
        const { users } = this.state;
        return (
            <div className="userList">
                {Object.keys(users).map((userKey) =>
                    (
                        <div key={userKey}>{users[userKey]}</div>
                    )
                )}
            </div>
        );
    }
}