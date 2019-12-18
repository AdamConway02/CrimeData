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
    // the .pluc is used to remove the pretty repeating in every row
    req.db.from('offence_columns').select('pretty').pluck('pretty')
        .then((rows) => {
            res.json({"offences": rows });
        })
        .catch((err) => {
            console.log(err)
            res.json({ "Error": true, "Message": "Error executing Mysqlquery" });
        })
});


module.exports = router;