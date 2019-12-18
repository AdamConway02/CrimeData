// react 
import React, { Component } from 'react';

// leaflet
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


// by default marker does not render properly so this code is added to show marker properly
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


// this class controls the component for the Map page
export default class SimpleExample extends Component {

    //----------------------------
    //      Constructor 
    //----------------------------

    constructor(props) {
        super(props);
        this.state = {
            token: global.usertoken,
            lat: -23.,
            lng: 145,
            zoom: 5,
            datagot: false,
            showmap: false,
            offences: [],
            stopinfiniteoffenses: false,
            Results: [],
            isLoaded: true,
            showselect: '',
            searched: false,
            Markers: []
        };
    }

    //----------------------------
    //      Methods  
    //----------------------------

    // get offences is used to fill the selector with the currently registered offences list
    // when called the function well return html which will show a select box for the user 
    getoffenses = () => {
        // if statement to stop the request after the information is retreived.
        if (this.state.stopinfiniteoffenses === false) {

            // fetch("https://cab230.hackhouse.sh/offences")
            fetch("https://localhost/offences")
            // fetch("https://172.22.24.177/offences")
                .then(results => results.json())
                    .then((result) => {
                        this.setState({
                            offences: result.offences,
                            stopinfiniteoffenses: true,
                        });
                    },
                        (error) => {
                            this.setState({
                                error
                            });
                        }
                    )
            }
        // return html which puts a select tag in which contains all the offences.
        return (
                <select id="crimeselect">
                    {this.state.offences.map(offences => (
                        <option value="${offences}" key={offences}>{offences}</option>
                    ))}
                </select>
            )
        }

        // Conduct Search sends a request to the server with correct format
        // the response is then used to update the component state.
        conductsearch = () => {
            let currentComponent = this;

            currentComponent.setState({
                isLoaded: false,
            })

            // get value from select box
            let selection = document.getElementById("crimeselect");
            let selectedCrime = selection.options[selection.selectedIndex].text;
            currentComponent.setState({
                showselect: selectedCrime
            })

            // setting up fetch request
            let getParam = { method: "GET" };
            let head = { Authorization: `Bearer ${this.state.token}` };
            getParam.headers = head;

            const baseUrl = "https://localhost/search?";
            // const baseUrl = "https://cab230.hackhouse.sh/search?";
            // const baseUrl = "https://172.22.24.177/search?"


            // get selectedcrime index and put it in a string
            let query = `offence=${selectedCrime}`;
            // combine the string
            let url = baseUrl + query;
            // make string into proper format for url request
            url = encodeURI(url)
            // encodeURI does not change & so manual replacement to encoded type.
            url = url.replace("&", "%26")

            // send the request to the server 
            // change the state depending on response
            fetch(url, getParam)
                .then(function (response) {
                    // if response is ok update the state
                    if (response.ok) {
                        currentComponent.setState({
                            searched: true,
                        })
                        return response.json();
                    } else {
                        // if response was not ok update the state to show error
                        currentComponent.setState({
                            error: true,
                            searched: true,
                        })
                        throw new Error("Network response was not ok.");
                    }
                })

                // if response was ok assign the results of the response to the state
                .then(function (result) {
                    currentComponent.setState({
                        Results: result.result,
                        datagot: true,
                        isLoaded: true,
                    })
                })
                // if error occured log the error in console.
                .catch(function (error) {
                    console.log("There has been a problem with your fetch operation: ", error.message);
                })
        }

        // render the infomration onto the page depending on current state of State
        render() {
            // position is starting position of map
            const position = [this.state.lat, this.state.lng]

            // get information form state
            const { token, error, isLoaded, showmap, datagot, showselect, Results } = this.state;

            // if there was an error tell that to user
            if (error) {
                return (
                    <div>
                        <p> Something went wrong</p>
                    </div>
                )
            }
            // if the user is not logged in dont show map functionality
            if (token === null) {
                return (
                    <div>
                        <h3> Map Page </h3>
                        <p>User not logged</p>
                        <p>Log in to use Map Functionality</p>
                    </div>
                )
            } else {
                // user now logged in
                // if the page has not finished gathering data show loading page
                if (isLoaded === false) {
                    return (<p> Fetching data please wait</p>)
                }
                // if the user has not selected data yet to be shown on the map
                else if (showmap === false && datagot === false) {
                    return (
                        <div>
                            <h3> Map Page </h3>
                            <div className="Selector">
                                <p> Select Crime</p>
                                {this.getoffenses()}
                                <br></br>
                                <div className="searchbutton">
                                    <button id="Search" className="button" onClick={() => this.conductsearch()}>Search</button>
                                </div>
                            </div>
                        </div>
                    )
                    // if this is returned it means there has been no error and the user
                    // has selected a offence to show on the map.
                    // the map uses react-leaflet to correctly load onto the page.
                    // the results from the fetch request are looped though adding markers
                    // to the map with binded popus to show the LGA of the marker along
                    // with the total number of offences occured in that area.
                } else {
                    return (
                        <div>
                            <h3> Map Page </h3>
                            <p> Select Crime</p>
                            {this.getoffenses()}
                            <br></br>
                            <div className="searchbutton">
                                <button id="Search" className="button" onClick={() => this.conductsearch()}>Search</button>
                            </div>
                            <div className="Selector">
                                <h2> Results for {showselect} </h2>
                                <Map style={{ height: "750px", width: "95%" }} center={position} zoom={this.state.zoom}>
                                    <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                    {Results.map(marker => (
                                        <Marker position={[marker.lat, marker.lng]} key={marker.LGA}>
                                            <Popup>
                                                <p>{marker.LGA}</p>
                                                Number of Offences: {marker.total}
                                            </Popup>
                                        </Marker>
                                    ))
                                    }


                                </Map>
                            </div>

                        </div>
                    )
                }
            }
        }
    }