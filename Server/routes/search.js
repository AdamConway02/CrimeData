var express = require('express');
var router = express.Router();
var cors = require('cors')
const mysql = require('mysql')
var jwt = require('jsonwebtoken');
var app = express();
// const uri = require('uri-js')


//--------------------------------
//   Setup
//--------------------------------
var options = require('../knexfile.js')
var knex = require('knex')(options)

// app.use((req, res, next) => {
//     req.db = knex
//     next()
// })


//--------------------------------
//   Routes
//--------------------------------

app.options('/?', cors())
router.get("/?", cors(), function (req, res, next) {

    // authorization
    const fullUrl = req.originalUrl;
    let token = req.headers.authorization
    // if no token show error
    try {
        token = token.replace('Bearer ', '')
    }
    catch (error) {
        return res.status(401).send({
            "error": "oops! it looks like you're missing the authorization header"
        });
    }


    if (token) {
        jwt.verify(token, 'secretkey', function (err) {
            if (err) {
                return res.status(401).send({
                    "error": "oh no! it looks like your authorization token is invalid"
                });
            } else {
                let age;
                let gender;
                let area;
                let year;
                let offence;


                // set up url to be search through

                let tempurl = fullUrl.match('\offence=(.*?)?$')
                let offencecheck = tempurl

                //check if offence is there
                if (offencecheck === null) {
                    return res.status(400).send({
                        "error": "oops! it looks like you're missing the offence query parm"
                    });
                }

                //check if offence query is there
                offencecheck = offencecheck[0].split('=')
                if (offencecheck[1] === '' || offencecheck[1] === "&age" || offencecheck[1] === "&year" || offencecheck[1] === "&area" | offencecheck[1] === "&gender") {
                    return res.status(400).send({
                        "error": "oops! it looks like you're missing the offence query parm"
                    });
                }



                // area requires pretty so before cleaning url get area if it exists
                var regex = /area(.*?)?$/
                if ((regex).test(fullUrl)) {
                    let prettyarea = fullUrl.match(regex)
                    prettyarea = prettyarea[1].replace(/%20/g, ' ')
                    prettyarea = prettyarea.split("&");
                    prettyarea = prettyarea[0];
                    area = prettyarea.replace('=', '')
                }

                //********************************************************************************* */

                // getting the offence

                // problem with & inside the offence param of the query 
                let offenceget = tempurl[0]
                offenceget = decodeURI(offenceget)
                offenceget = offenceget.split("&")
                offenceget = offenceget[0]
                offenceget = req.query.offence


                // the first positon will always be the offence
                offence = offenceget
                // console.log("offence:", offence)
                // this is bad decode didnt work
                offence = offence.replace(/-/g, '')
                offence = offence.replace(/ /g, '')
                offence = offence.replace(/\//g, '')
                offence = offence.replace(/&/g, '')
                offence = offence.replace(/\(/g, '')
                offence = offence.replace(/\)/g, '')
                offence = offence.replace(/\./g, '')
                offence = offence.replace(/\;/g, '')




                //********************************************************************************************** */


                tempurl = tempurl[1].replace(/%20/g, '')
                tempurl = tempurl.toLowerCase();


                let urlarray = tempurl.split("&")

                for (let i = 1; i < urlarray.length; i++) {
                    let string = urlarray[i]
                    if ((/gender(.*?)?$/).test(string)) {
                        let sortarray = string.split('=');
                        gender = sortarray[1];
                    } else if ((/age(.*?)?$/).test(string)) {
                        let sortarray = string.split('=');
                        age = sortarray[1];
                    } else if ((/year(.*?)?$/).test(string)) {
                        let sortarray = string.split('=');
                        year = sortarray[1];
                    }
                }

                // no multiple of the same params aka 2001,2002
                knex('offences')
                    .join('areas', 'offences.area', '=', 'areas.area')
                    .select('offences.area as LGA')
                    .sum({ total: offence })
                    .select('areas.lat', 'areas.lng')
                    .as('total').groupBy('offences.area')
                    .modify(function (qb) {
                        if (age) {
                            qb.where('offences.age', age)
                        }
                        if (gender) {
                            qb.where('offences.gender', gender)
                        }
                        if (area) {
                            qb.where('offences.area', area)
                        }
                        if (year) {
                            qb.where('offences.year', year)
                        }

                    })
                    .then((rows) => {
                        let query = req.query
                        res.json({ "query": query, "result": rows });
                    })
                    .catch((err) => {
                        console.log(err)
                        return res.status(500).send({ "error": "oh no! It looks like there was a database error while performing your search, give it another try...", "e": {} });
                    })
            }
        })

        // if no token given
    } else {
        return res.status(401).send({
            "error": "oops! it looks like you're missing the authorization header"
        });
    }
});




module.exports = router;
