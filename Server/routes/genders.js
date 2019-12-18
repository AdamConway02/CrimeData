var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var cors = require('cors')

var app = express();


//--------------------------------
//   Setup
//--------------------------------
// var options = require('../knexfile.js')
// var knex = require('knex')(options)

// app.use((req, res, next) => {
//     req.db = knex
//     next()
// })


//--------------------------------
//   Routes
//--------------------------------

router.get("/", cors(), function (req, res, next) {
    req.db.distinct().from('offences').select('gender').pluck('gender')
        .then((rows) => {
            res.json({"genders": rows });
        })
        .catch((err) => {
            console.log(err)
            res.json({ "Error": true, "Message": "Error executing Mysqlquery" });
        })
});


module.exports = router;