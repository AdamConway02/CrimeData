import React, { Component } from 'react';

// this class controls the component for the Seach page.
class Searchpage extends Component {

    //----------------------------
    //      Constructor 
    //----------------------------

    constructor(props) {
        super(props);
        this.state = {
            // Token used to see if user is logged in
            // retrieved from global token object
            token: global.usertoken,
            // the results of the refined search request
            Results: [],
            // the array of offences used to fill selector
            offences: [],
            // the array of years used to fill selector
            years: [],
            // the array of areas used to fill selector
            areas: [],
            // state for error checking
            error: null,
            // state to check if page is loaded
            isLoaded: false,
            // state to say if data has ben retrieved
            datagot: false,
            // state checking if data has been searched for
            searched: false,
            // state checking if user has requested refined data
            refined: false,
            // the selected index in teh selector for offences
            showselect: '',
            // checks to stop inifite request to server
            stopinfiniteoffenses: false,
            stopinfiniteareas: false,
            stopinfiniteyears: false,
            // this is what shows after user refines data
            refinedtitle: ''

        }
    }



    //----------------------------
    //      Methods  
    //----------------------------

    // conduct search is called when the user hits the search button
    conductsearch = () => {
        let currentComponent = this;
        // reset the refined title
        currentComponent.refinedtitle = ''


        // set loading to false
        currentComponent.setState({
            isLoaded: false,
        })

        // get value from select box
        let selection = document.getElementById("crimeselect");
        let selectedCrime = selection.options[selection.selectedIndex].text;
        currentComponent.setState({
            showselect: selectedCrime
        })

        // format string for request to server
        // the type of request
        let getParam = { method: "GET" };
        // adding Users token to head.
        let head = { Authorization: `Bearer ${this.state.token}` };
        getParam.headers = head;
        // the base url for the search endpoint
        // const baseUrl = "https://cab230.hackhouse.sh/search?";
        const baseUrl = "https://localhost/search?";
        // const baseUrl = "https://172.22.24.177/search?";



        // the query the created from the users selection of crime
        let query = `offence=${selectedCrime}`;
        // combining the base url with the user query
        let url = baseUrl + query;
        // encoding the new url to proper format
        url = encodeURI(url)
        // encodeURI did not format & so manual replacement for encode type.
        url = url.replace("&", "%26")

        console.log("URL: ", url);
        console.log("GetParam: ", getParam);


        // the fetch request used to format state.
        // its given the properly formatted url along with the head
        // which contains the user token so the server accepts the request.
        fetch(url, getParam)
            .then(function (response) {
                if (response.ok) {
                    // if response is type 200 set searched to true
                    currentComponent.setState({
                        searched: true,
                    })
                    // return the response in json format
                    return response.json();
                } else {
                    // if response was not ok error has occured.
                    // set error to true and searched to true.
                    currentComponent.setState({
                        error: true,
                        searched: true,
                    })
                    // if error occured throw the error.
                    throw new Error("Network response was not ok.");
                }
            })

            // if response was ok get the result and update the state
            .then(function (result) {
                console.log("results: ", result);
                currentComponent.setState({
                    // get the results from the response and assign them to the state.
                    Results: result.result,
                    datagot: true,
                    isLoaded: true,
                })
                // console.log(Results);

            })
            // if there was an error log the error.
            .catch(function (error) {
                console.log("There has been a problem with your fetch operation: ", error.message);
            })
    }


    // refine searched is used to refince the data retrived by the users selection
    refinesearch = () => {
        let currentComponent = this;
        // reset the refinedtitle
        currentComponent.refinedtitle = ''

        // set loading to false
        currentComponent.setState({
            isLoaded: false,
        })

        // get the crime selected by what is currently showing
        let selectedCrime = this.state.showselect
        // create filter string which will change depend on users selection
        let filter = (``);
        // get age from the selector for age
        let selectionage = document.getElementById("age")
        let selectedAge = selectionage.options[selectionage.selectedIndex].text;

        // log if user has not selected an age
        if (selectedAge === "Not Applied") {
            console.log("no age selected")
        } else {
            // if user has selected an age add the selected age to the filter string
            filter = filter + (`&age=${selectedAge}`);
            currentComponent.refinedtitle += ` Age: ${selectedAge},`;
        }

        //get gender
        let selectiongender = document.getElementById("gender")
        let selectedGender = selectiongender.options[selectiongender.selectedIndex].text;
        if (selectedGender === "Not Applied") {
            console.log("no gender selected")
        } else {
            filter = filter + (`&gender=${selectedGender}`);
            currentComponent.refinedtitle += ` Gender: ${selectedGender},`;
        }

        // get areas
        let selectionarea = document.getElementById("areaselect")
        let selectedArea = selectionarea.options[selectionarea.selectedIndex].text;
        if (selectedArea === "Not Applied") {
            console.log("no area selected")
        } else {
            filter = filter + (`&area=${selectedArea}`);
            currentComponent.refinedtitle += ` Area: ${selectedArea},`;
        }

        // get years
        let selectionyear = document.getElementById("yearselect")
        let selectedYear = selectionyear.options[selectionyear.selectedIndex].text;
        if (selectedYear === "Not Applied") {
            console.log("no year selected")
        } else {
            filter = filter + (`&year=${selectedYear}`);
            currentComponent.refinedtitle += ` Year: ${selectedYear},`;
        }

        // Format the url to be correctly encoded, look at conductsearch method for explination.
        let getParam = { method: "GET" };
        let head = { Authorization: `Bearer ${this.state.token}` };
        getParam.headers = head;
        // const baseUrl = "https://cab230.hackhouse.sh/search?";
        const baseUrl= "https://localhost/search?";
        // const baseUrl = "https://172.22.24.177/search?";
        let query = `offence=${selectedCrime}`;
        let url = baseUrl + query
        url = encodeURI(url)
        url = url.replace("&", "%26")

        // add refinment after encoding the url
        // the refinment is added after encoding as 
        // we do not want to change the format 
        // of the filter string as it is already in the
        // correct format.
        let refineurl = url + filter

        console.log(refineurl);
        // the fetch request to get the refined data
        fetch(refineurl, getParam)
            .then(function (response) {
                if (response.ok) {
                    // if response was type 200 set refined to true
                    currentComponent.setState({
                        refined: true,
                    })
                    return response.json();
                } else {
                    currentComponent.setState({
                        error: true,
                        refined: true,
                    })
                    throw new Error("Network response was not ok.");
                }
            })

            // overwrite the results state with the new refined data
            .then(function (result) {
                currentComponent.setState({
                    Results: result.result,
                    datagot: true,
                    isLoaded: true,
                })

            })
            .catch(function (error) {
                console.log("There has been a problem with your fetch operation: ", error.message);
            })
    }

    // return a selector filled with the offence list
    getoffenses = () => {
        // if statement is used to stop inifinte request to server.
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
        // returns html so where get offences is called a select tag is made and insereted into
        // that position
        return (
            <select id="crimeselect">
                {this.state.offences.map(offences => (
                    <option value="${offences}" key={offences}>{offences}</option>
                ))}
            </select>
        )
    }

    // Similar to get offences but fills the selector with areas not offences
    getareas = () => {
        if (this.state.stopinfiniteareas === false) {
            // fetch("https://cab230.hackhouse.sh/areas")
            fetch("https://localhost/areas")
            // fetch("https://172.22.24.177/areas")

                .then(results => results.json())
                .then((result) => {
                    this.setState({
                        areas: result.areas,
                        stopinfiniteareas: true
                    });
                },
                    (error) => {
                        this.setState({
                            error
                        });
                        return ("somthing went wrong");
                    }
                )
        }
        // returns a selector with LGA options
        return (
            <select id="areaselect">
                <option value="NA">Not Applied</option>
                {this.state.areas.map(areas => (
                    <option value="${areas}" key={areas}>{areas}</option>
                ))}
            </select>
        )
    }

    // Same as previous two methods but with years
    getyears = () => {
        if (this.state.stopinfiniteyears === false) {
            fetch("https://localhost/years")
            // fetch("https://cab230.hackhouse.sh/years")
            // fetch("https://172.22.24.177/years")

                .then(results => results.json())
                .then((result) => {
                    this.setState({
                        years: result.years,
                        stopinfiniteyears: true
                    });
                },
                    (error) => {
                        this.setState({
                            error
                        });
                    }
                )
        }
        return (
            <select id="yearselect">
                <option value="NA">Not Applied</option>
                {this.state.years.map(years => (
                    <option value="${years}" key={years}>{years}</option>
                ))}
            </select>
        )
    }

    // render table is used to load a table onto the page
    // the table is created from the results stored in the component state
    // when called the table body will be put in the location of the call.
    // to be properly renders the render table function must be surronded by
    // table and tbody tags
    renderTable = () => {
        return this.state.Results.map(value => {
            return (
                <React.Fragment key={value.LGA}>
                    <tr>
                        <td> {value.LGA}</td>
                        <td> {value.total}</td>
                        <td> {value.lat}</td>
                        <td> {value.lng}</td>
                    </tr>
                </React.Fragment>
            )
        })
    }

    // the render method is reacts way of handling what is loaded onto the screen.
    render() {
        // get the current state of the component.
        const { token, error, isLoaded, datagot, searched, showselect } = this.state;

        // if there is no token do not give user search functionality
        if (token === null) {
            return (
                <div>
                    <h3> Search Page </h3>
                    <p>User not logged</p>
                    <p>Log in to use search functionality</p>
                </div>
            );
            // if the user has searched for results with only the offence
        } else if (searched) {
            // if the something went wrong tell the user.
            if (error) {
                return (
                    <div>
                        <p>Something Went Wrong :(</p>
                        <button id="Failed" className="button" onClick={() => window.location.reload()}>Back</button>
                    </div>)
            }
            // if page has not gotten all the data show loading page.
            else if (!isLoaded) {
                return (<p> Fetching data please wait</p>)
            }
            // if user has made a seach using the offence search button
            else if (datagot) {
                // if page is not loaded.
                if (!isLoaded) {
                    return (<p> Fetching data please wait</p>)
                }
                // this return statement is for when a user has made a search
                // for results using only offences 
                // the page now loads in the refining search features 
                // along with the table the user origianlly searched for
                else {
                    return (
                        <div className="searchHeader">
                            <h3> Search Page </h3>
                            <div className="Selector">
                                <p> Select Crime</p>
                                {// this function puts a selector box on the page and fills it with the the offences
                                // which it got from the server
                                }
                                {this.getoffenses()}
                                <br></br>
                                <div className="searchbutton">
                                    <button id="Search" className="button" onClick={() => this.conductsearch()}>Search</button>
                                </div>
                            </div>

                            <h2> Results for {showselect}</h2>
                            <p>Sorting</p>
                            Age: &nbsp;
                        <select id="age">
                            {// fill the select box with the requried ages
                            // this could be done similary to offences and areas
                            // but since its a small list hardcode will work for now
                            // as this project has no growth planned.
                            }
                                <option value="NA">Not Applied</option>
                                <option value="Adult">Adult</option>
                                <option value="Juvenile">Juvenile</option>
                            </select>
                            &emsp;Gender:&nbsp;
                        <select id="gender">
                                <option value="NA">Not Applied</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Not Stated">Not Stated</option>
                            </select>
                            &emsp;Areas:&nbsp;
                            {// once again getting a selector box but this time with the areas
                            }
                        {this.getareas()}
                            &emsp;Year:&nbsp;
                        {this.getyears()}
                            <br></br>
                            <div className="refinebutton">
                                <button id="Refine" className="button" onClick={() => this.refinesearch()}>Refine</button>
                            </div>

                            <p>refined by {this.refinedtitle}</p>
                            <table className="searchTable">
                                <tbody>
                                    <tr>
                                        <th> LGA</th>
                                        <th> Count </th>
                                        <th> long </th>
                                        <th> lat </th>
                                    </tr>
                                    {this.renderTable()}
                                </tbody>
                            </table>
                        </div>
                    )
                }
            }
        }
        // this return is for when page is first loaded an no search has been requested yet.
        // is a user leaves goes to another page and return this page is rendered as state 
        // is reset upon clicking the search tag in the navbar.
        else {
            return (
                <div className="searchHeader">
                    <h2> Search Page </h2>
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
        }
    }
}

export default Searchpage;
