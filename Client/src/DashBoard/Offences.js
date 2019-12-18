import React, { Component } from 'react';

// this class controls the component for the Offences page.
class Offences extends Component {

    //----------------------------
    //      Constructor 
    //----------------------------

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            offences: []
        };
    }

    //----------------------------
    //      Methods  
    //----------------------------

    // on page selection hit the offences endpoint and
    // update the state depending on the response
    componentDidMount() {
        // fetch("https://172.22.24.177/offences")
        // fetch("https://cab230.hackhouse.sh/offences")
        fetch("https://localhost/offences")        
            .then(results => results.json())
            // if results are gotten
            .then((result) => {
                this.setState({
                    // assign the response objects results to the state object
                    offences: result.offences,
                    // set loading to finished
                    isLoaded: true,
                });
            },
            // if something went wrong
                (error) => {
                    this.setState({
                        // set error to true 
                        error,  
                        // set loading to finished                       
                        isLoaded: true,
                    });
                }
            )
    }

    // the render function is what react uses to load information to the page.
    // the information displayers changed depending on the state of the objects in State.
    render() {
        // get the values from the state
        const { error, isLoaded, offences } = this.state;
        if (error) {
            console.log("error : " + error.message)
            return <div>Something Went Wrong :(</div>;
        } else if (!isLoaded) {
            return <div>Loading..</div>
            // if there was no error and the page has finished loading
            // return the offences in a list.
        } else {
            return (
                <div className="offenceslist">
                    <h3>A list of all Offences</h3>
                    <ul>
                        {offences.map(offences => (
                            // maps though the results gotten from server and displays them in a list
                            <li key={offences}>
                                {offences}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    }
}

export default Offences;
