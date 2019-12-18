// React 
import React from 'react';
import ReactDOM from 'react-dom';
// My css file
import './index.css';
// Service worker
import * as serviceWorker from './serviceWorker';
// React Router
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// components
import Signuppage from './Authentication/Signup';
import Offences from './DashBoard/Offences';
import Homepage from './DashBoard/Homepage';
import Loginpage from './Authentication/login';
import Searchpage from './DashBoard/search';
import Logout from './Authentication/logout';
import map from './DashBoard/map';

//----------------------------
//      Properties 
//----------------------------
global.usertoken = null;
global.username = '';
global.userpass = '';


//----------------------------
//      Method
//----------------------------

// Navbar is the parent of all the components is this application
// the navbar is what controlls what component is loaded onto the page
// using React-Router.
// Depending on the path the content of the page changes, the buttons
// in the nav change the path therefor changing the content loaded.
function Navbar() {
    return (
        <Router>
            <div className="NavBarcontainer">
                <img className="image" src={require('./images/logo.png')} alt="Logo"></img>
                <div className="buttoncontainer">
                    <Link className="button" to={"/"}>Homepage</Link>
                    <Link className="button" id="regbutton" to={"/Signup"}>Register</Link>
                    <Link className="button" id="loginbutton" to={"/login"}>Login</Link>
                    <Link className="button" to={"/Offences"}>Offences</Link>
                    <Link className="button" to={"/search"}>Search</Link>
                    <Link className="button" to={"/map"}>map</Link>
                    <Link className="button" to={"/logout"}>Logout</Link>
                </div>
            </div>

            <div className="content">
                <main>
                    <Route exact path="/" component={Homepage} />
                    <Route path="/Offences" component={Offences} />
                    <Route path="/Signup" component={Signuppage} />
                    <Route path="/login" component={Loginpage} />
                    <Route path="/search" component={Searchpage} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/map" component={map} />
                </main>
            </div>
        </Router>
    )
}

// render the component onto the page 
ReactDOM.render(<Navbar />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
