require('dotenv').config()
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');


var index = require('./routes/index');
var users = require('./routes/users');
var psetbank = require('./routes/psetbank');
var qtibank = require('./routes/qtibank');
var cmlbank = require('./routes/cmlbank');

var mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/conFusion");
// package dotenv with require('dotenv').config() and .env file at project root provide value of process.env.MONGODB_URI
var mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/conFusionA" // "mongodb+srv://<username>:<password>@ims.psokp.mongodb.net/<database>?retryWrites=true&w=majority" IS OK
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true })  // mongoose 5.10 {useNewUrlParser: true, useUnifiedTopology: true }
var db=mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var app = express();
app.set('json spaces', 2)
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/psetbank',psetbank)
app.use('/qtibank',qtibank)
app.use('/cmlbank',cmlbank)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
