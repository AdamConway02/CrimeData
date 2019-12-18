var express = require('express');
var router = express.Router();
var cors = require('cors');
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
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

/*
login

user makes request to server with details in body
server gets details checks them against database
if details do not exists return error 
if details do exists return token
*/
// if not add user to registration
router.post('/', cors(), (req, res, ) => {
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password);
	
	if (!email || !password){
	return res.status(401).send({"message": "invalid login - you need to supply both an email and password"})

	}

    knex.select("email").from("users").where("email", email)
        .then(emaillist => {
            // if user does not exists
            if (emaillist.length === 0) {
		res.status(401);
      		return res.json({"message": "oh no! It looks like that user doesn't exist..."})
            }
            // user email does exist
            else {
                // check if submmited password matches the db password for that email
                // getting the password form the database
                knex.select("password").from("users").where("email", email).pluck('password')
                    .then((rows) => {
                        return rows;
                    }).then((dbpass) => {
                        if (bcrypt.compareSync(req.body.password, dbpass[0])) {
                            knex.select("id").from("users").where("email", email).pluck('id')
                            .then((id) => {
                                let expire = 24*60*60
                                let token = jwt.sign({ id: id }, 'secretkey', { expiresIn: expire });
                                return res.json({ token: token, access_token: token, token_type: "Bearer", expires_in: expire })
                            })
                        } else {
                            res.status(401);
                            return res.json({"message": "invalid login - you need to supply both an email and password"})
                        }
                    })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(401);
            return res.json({ "Error": true, Message: "Error Logging into Account" });
        })
});


// res.json({ status: "success", message: "User added successfully!!!" });
// return knex('users').insert([{ email: email, password: password }])
module.exports = router;
