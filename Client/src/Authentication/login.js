import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'


/*
This Class controls the user login page
*/


class Loginpage extends Component {

    //----------------------------
    //      Properties
    //----------------------------

    //----------------------------
    //      Constructor 
    //----------------------------

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: global.username,
            JWT: global.usertoken,
            password: global.userpass,
            submit: false,
            isLoaded: false,
            validated: true,
        }
    }

    //----------------------------
    //      Methods
    //----------------------------

    // the method runs when the user hits the login button.
    Submit = () => {

        // Variables

        // I set currentComponent to this for my personal understandning on scope context
        let currentComponent = this;

        // Setting varibles to what is the state for cleaner access to the value.
        let email = this.state.email
        let password = this.state.password

        // let JWT = this.state.JWT

        // function that hits the api with the information from the filled out forms.
        // changes the state of this class depending on the response of the request

        // fetch("https://cab230.hackhouse.sh/login", {

        fetch("https://localhost/login", {
        // fetch("https://172.22.24.177/login", {

            method: "POST",
            // TODO Remove once testing is completed
            // body: `email=useradam@mail.com&password=madaresu.`,
            body: `email=${email}&password=${password}`,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {
                // success
                if (response.ok) {
                    currentComponent.setState({
                        submit: true,
                    })
                    return response.json();
                } else {
                    //fail
                    currentComponent.setState({
                        error: true,
                        submit: true,
                        isLoaded: true,
                    })
                    throw new Error("network response failed")
                }
            })
            .then(function (result) {
                // the the token form the response and store it in the state/\.
                currentComponent.setState({
                    JWT: result.token,
                    isLoaded: true,
                })
                // assign the stored token to the global token for use in search functionality.
                global.usertoken = currentComponent.state.JWT;
                // console.log(global.usertoken)
            })
            .catch(function (error) {
                console.log("the fetch operation failed user not logged in beacuse: ", error.message)
            })
    }

    // the render function is a react function that loads information onto the page
    render() {

        // get the varible from the component state to allow control on what to show.
        const { error, JWT, email, password, submit, isLoaded, validated, } = this.state;

        // this submit is rendered if the users has pressed the button and depending on the response of the
        // fetch request different results are shown.
        if (submit) {
            if (!validated) {
                return (
                    <div>
                        <p> an invalid character was used in the username or password</p>
                        <button id="Failed" className="button" onClick={() => window.location.reload()}>Back</button>
                    </div>
                )
            }
            //check for errors.
            else if (error) {
                console.log("error " + error.message)
                return (
                    <div className=" failed login">
                        <p> Invalid username or password </p>
                        <p> please make sure all you details are correct.</p>
                        <p> if you are not a currently registered user please register before logging in.</p>
                        <button id="Failed" className="button" onClick={() => window.location.reload()}>Back</button>
                    </div>
                )
            }
            // check to see if information is loaded.
            else if (!isLoaded) {
                return (
                    <div className="loading">
                        <p> Attempting to log user in please wait</p>
                    </div>
                )
            }
            // check to ensure username and password is useable.

            // if the login is successfull redirect user to the offences page.
            else {
                return (
                    <div>
                        <Redirect to='/offences' />
                    </div>
                )
            }
        }

        // this page is loaded if the user has just created an account and not hit the submit button
        if (email !== '' && JWT == null) {
            return (
                <div className="Loginform" >
                    <div className="information">
                        <h3> Login Page</h3>
                        <p> Please enter the  Username and password of your account</p>
                        <p> If you have not created an account please go to the registration page</p>
                    </div>
                    <form>
                        <input
                            placeholder={email}
                            type="email"
                            email="email"
                            id="email"
                            value={email}
                            onChange={e => {
                                // check for any spaces used in the email 
                                const { value } = e.target;
                                if (/\s/.test(value)) {
                                    this.setState({ validated: false })
                                }
                                else if (/!?\s/.test(value)) {
                                    this.setState({ validated: true })
                                }
                                this.setState({ email: e.target.value })
                            }} />
                        <br></br>
                        <input
                            placeholder={password}
                            type="password"
                            password="password"
                            id="password"
                            value={password}
                            onChange={event => {
                                const { value } = event.target;
                                //Regex Checks for any space in the password
                                if (/\s/.test(value)) {
                                    this.setState({ validated: false })
                                }
                                // todo
                                else if (/!?\s/.test(value)) {
                                    this.setState({ validated: true })
                                }
                                this.setState({ password: event.target.value })
                            }}
                        />
                    </form>
                    <br></br>
                    <button id="Login" className="button" onClick={() => this.Submit()}>Login</button>
                </div>
            );
        } else if (JWT !== null) {
            // if user has already logged in
            return (
                <div>
                    <p>A user is currently logged in</p>
                    <p>to log in with a different account, log current user out.</p>
                </div>
            )

        }
        else {
            // user has not attempted registration
            return (
                <div className="Loginform" >
                    <div className="information">
                        <h3> Login Page</h3>
                        <p> Please enter the  Username and password of your account</p>
                        <p> If you have not created an account please go to the registration page</p>
                    </div>
                    <form>
                        <input
                            placeholder="email"
                            type="email"
                            email="email"
                            id="email"
                            value={email}
                            onChange={e => {
                                // check for any spaces used in the email
                                const { value } = e.target;
                                if (/\s/.test(value)) {
                                    this.setState({ validated: false })
                                }
                                else if (/!?\s/.test(value)) {
                                    this.setState({ validated: true })
                                }
                                this.setState({ email: e.target.value })
                            }} />
                        <br></br>
                        <input
                            placeholder="password"
                            type="password"
                            password="password"
                            id="password"
                            value={password}
                            onChange={event => {
                                const { value } = event.target;
                                if (/\s/.test(value)) {
                                    this.setState({ validated: false })
                                }
                                this.setState({ password: event.target.value })
                            }}
                        />
                    </form>
                    <br></br>
                    <button id="Login" className="button" onClick={() => this.Submit()}>Login</button>
                </div>
            );
        }
    }
}

export default Loginpage;
