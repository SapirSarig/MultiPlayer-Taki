import React from 'react';
import ReactDOM from 'react-dom';
import takiImage from './resources/takiLogo.jpg';

export default class LoginModal extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            errMessage: ""
        }

        this.handleLogin = this.handleLogin.bind(this);        
    }
    
    render() {
        return (
            <div className="login-page-wrapper">
                <img className="taki-logo" src={takiImage} />
                <form onSubmit={this.handleLogin}>
                    <label className="username-label" htmlFor="userName"> Name: </label>
                    <input className="username-input" name="userName"/>                        
                    <input className="submit-btn btn" type="submit" value="Login"/>
                </form>
                {this.renderErrorMessage()}
            </div>
        );
    }

    renderErrorMessage() {
        if (this.state.errMessage) {
            return (
                <div className="login-error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

    handleLogin(e) {
        e.preventDefault();
        const userName = e.target.elements.userName.value;
        fetch('/users/addUser', {method:'POST', body: userName, credentials: 'include'})
        .then(response=> {            
            if (response.ok){
                this.setState(()=> ({errMessage: ""}));
                this.props.loginSuccessHandler();
            } else {
                if (response.status === 401) {
                    this.setState(()=> ({errMessage: "User name empty."}));
                }
                else if (response.status === 403) {
                    this.setState(()=> ({errMessage: "User name already exists, please try another one."}));
                }
                this.props.loginErrorHandler();
            }
        });
        return false;
    }    
}