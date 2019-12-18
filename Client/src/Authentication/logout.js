import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'


// this class controls the component for the logout screen

class Logout extends Component {

    //----------------------------
    //      Constructor 
    //----------------------------

    constructor(props) {
        super(props);
        this.state = {
            logged: null,
        }
    }

    //----------------------------
    //      Methods  
    //----------------------------

    // the method runs when the user hits the login button.    
    Submit = () => {
        global.usertoken = null;
        this.setState({
            logged: false
        })
    }

    // the render function is a react function that loads information onto the page
    render() {
        // if user is logged in show information for logout page.
        if (global.usertoken !== null && this.state.logged === null) {
            return (
                <div className="logoutpage">
                    <h3>Logout</h3>
                    <p> Are you sure you want to log out</p>
                    <button id="Login" className="button" onClick={() => this.Submit()}>Logout</button>
                </div>
            )
        // once the user logs out redirect to login page
        } else if (this.state.logged === false) {
            return (
                <div className="logoutpage">
                        <Redirect to='/login' />
                </div>
            )
        }
        // if above statements are not satisfied, it means user is already logged in
        else {
            return (
                <div className="logoutpage">
                    <h3>Logout</h3>
                    <p> No user logged in cannot log out.</p>
                </div>
            )
        }

    }
}

export default Logout;
