//--------------------------------
//   Require Statements
//--------------------------------
var createError = require('http-errors');
var express = require('express');
var helmet = require('helmet')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUI = require('swagger-ui-express')
var swaggerDocument = require('./docs/swaggercrime.json')
var cors = require('cors')

// //Https
// const fs = require('fs')
// const https = require ('https')
// const privateKey =fs.readFileSync('./sslcert/cert.key', 'utf8');
// const certificate =fs.readFileSync('./sslcert/cert.pem', 'utf8');
// const credentials = {
//   key: privateKey,
//   cert: certificate
// };

// routers
var router = express.Router();
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var offencesRouter = require('./routes/offences')
var areasRouter = require('./routes/areas')
var agesRouter = require('./routes/ages')
var gendersRouter = require('./routes/genders')
var yearsRouter = require('./routes/years')
var registrationRouter = require('./authentication/signup')
var loginRouter = require('./authentication/login')
var searchRouter = require('./routes/search')



// knex stuff
const options = require('./knexfile.js')
const knex = require('knex')(options);
//-----------------------------------------------------




var app = express();

app.options('*', cors())

var corsOptions = {
  contentSecurityPolicy: 'unsafe-inline'
}

// //helmet with content security Policy 
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
//   }
// }))

app.use(helmet())


// Knex setup
app.use((req, res, next) => {
  req.db = knex
  next()
});





//Dont touch Cookey cutter code
//-----------------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//-------------------------------------------------------


//--------------------------------
//   Route Control
//--------------------------------



app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/offences', offencesRouter);
app.use('/areas', areasRouter);
app.use('/ages', agesRouter);
app.use('/genders', gendersRouter);
app.use('/years', yearsRouter);
app.use('/register', registrationRouter);
app.use('/login', loginRouter);
app.use('/search', searchRouter);
// swagger docs
app.use('/', cors(corsOptions), swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


//--------------------------------
//   Error Handeling
//--------------------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// //for https
// const server = https.createServer(credentials,app);
// server.listen(443);

module.exports = app;
