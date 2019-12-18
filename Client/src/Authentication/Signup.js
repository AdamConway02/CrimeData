import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'


// this class controls the component for the Signup Page
class Signuppage extends Component {

    //----------------------------
    //      Constructor 
    //----------------------------

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: "",
            password: "",
            submit: false,
            isLoaded: false,
            validated: true,
            JWt: global.usertoken,
        }
    }

    //----------------------------
    //      Methods 
    //----------------------------

    /*
    logic user puts in email and password
    once submit is pressed try to register user 
    if succesfull take user to login page
    if not successfull say registration failed 
    */
   
    // this Methods runs when the user presses the submit button on the page
    // depending on what the response of the fetch request is change the state
    // of the class and then show the information to the user.
    Submit = () => {
        let currentComponent = this;
        global.username = this.state.email
        global.userpass = this.state.password

        // fetch("https://cab230.hackhouse.sh/register", {
        fetch("https://localhost/signup", {
        // fetch("https://172.22.24.177", {
            method: "POST",
            body: `email=${global.username}&password=${global.userpass}`,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {
                if (response.ok) {
                    currentComponent.setState({
                        // if the user is succesfully registered change the success state to true
                        submit: true,
                        isLoaded: true,
                    })
                } else {
                    // if response was not okay change error state to true and show error in log
                    currentComponent.setState({
                        error: true,
                        submit: true,
                        isLoaded: true,
                    })
                    throw new Error("network response failed")
                }
            })
            // if there was an error, log the error in the console.
            .catch(function (error) {
                console.log("the fetch operation has failed user not registered becasue:", error.message)
            })
    }

    // the render function is a react function that loads information onto the page
    render() {
        // get the state objects to control what will be shown.
        const { error, email, password, submit, isLoaded, validated, } = this.state;

        // if button has been pressed
        if (submit) {
            // if there was an error in registration
            if (error) {
                console.log("error:" + error.message)
                return (
                    <div className="failed registration">
                        <p> Unsuccseful registration!!!!</p>
                        <p> Please Make sure all details are correct and the username and password fields are not empty</p>
                        <p> A user with the same details may already be registered. </p>
                        <button id="Failed" className="button" onClick={() => window.location.reload()}>Back</button>
                    </div>
                )
            }
            // if the page has not finished loading required information
            else if (!isLoaded) {
                return (
                    <div> Registering User please be patient</div>
                )
            // if the user inputted an invalid character
            } else if (!validated) {
                return (
                    <div>
                        <p> an invlaid character was used please refrain from using space in emails and passwords</p>
                        <button id="Failed" className="button" onClick={() => window.location.reload()}>Back</button>
                    </div>
                )
            }
            // if error false and loading is done the only option left is successful registration
            // redirect the user to the login page
            else {
                return (
                    <Redirect to='/login' />
                )
            }
        }
        // if the button has not been pressed load the form onto the page
        else {
            return (
                <div className="Signupform">
                    <div className="information">
                        <h3>Registration page</h3>
                        <p> Please Enter a new Username and password</p>
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
                                // check for any spaces used in password
                                const { value } = event.target;
                                if (/\s/.test(value)) {
                                    this.setState({ validated: false })
                                }
                                else if (/!?\s/.test(value)) {
                                    this.setState({ validated: true })
                                }
                                this.setState({ password: event.target.value })
                            }}
                        />
                    </form>
                    <br></br>
                    <button id="register" className="button" onClick={() => this.Submit()}>Register</button>
                </div>
            );
        }
    }
}

export default Signuppage;
