var express = require('express');
var router = express.Router();
var cors = require('cors');
var bcrypt = require('bcryptjs')
var app = express();


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

//check if user already registered
// if not add user to registration
router.post('/', cors(), (req, res, ) => {
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);

    if (!email || !password) {
        res.status(400);
        res.json({"message": "error creating new user - you need to supply both an email and password" });
    } else {
        knex.select("email").from("users").where("email", email)
            .then(emaillist => {
                if (emaillist.length === 0) {
                    res.json({ "message": "yay! you've successfully registered your user account :)" });
                    return knex('users').insert([{ email: email, password: password }])
                }
                else {
                    res.status(400);
                    res.json({"Message": "oops! It looks like that user already exists" });
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(401)
                res.json({ status: "failure", "Message": "Error creating account" });
            })
    }
});

module.exports = router;
