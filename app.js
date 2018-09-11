const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bluebird = require('bluebird');

/*Load Environment variables*/
const dotenv = require('dotenv');
dotenv.config();

/**
 * Database connection
 */
const mongoose = require('mongoose');
const mongo_url = process.env.DB_URL;
mongoose.Promise = bluebird;
mongoose.connect(mongo_url).then(
  () => { //Connection success
    console.log('Connected to MongoDB Successfully!');
  }
).catch(err => {
  console.error.bind(console, 'MongoDB connection error:')
});

// import all routes
const index = require('./routes/index');
const users = require('./routes/users');
const register = require('./routes/register');
const login = require('./routes/login');
const events = require('./routes/events');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// un-comment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
