import React, { Component } from 'react';

// this class controls the component for the homepage
class Homepage extends Component {
    // not much to do on this page other than render the information.
    render() {
        return (
            <div className="HomePage">
                <h1>Getting Started With Crime</h1>

                <h4>This is a React application that retrives data about crime in Queensland.</h4>


                <p>Below is a list of functionalities for the website</p>
                <p>Register:</p>
                <p>Create an account to access all features of the website.</p>

                <p>Login:</p>
                <p>Login to an already Created account.</p>

                <p>Offences:</p>
                <p>See a list of all currently Registered offences.</p>
                <p> Search:</p>
                <p> Search that data and request spercific information. This is only available when logged in</p>

                <p>Map:</p>
                <p>see data from Crimes commited in regions of Queensland. Must be logged in</p>

                <p>To begin I recommend Creating an account so all features of this application become available to you.</p>
            </div >
        );
    }
}

export default Homepage;