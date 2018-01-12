import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import elasticsearch from 'elasticsearch';
import mongoose from 'mongoose';
import config from "./config/config";
import CoinModel from './models/Coin.model';
import api from './routes/api/api';


const dbMongoose = mongoose.connect(config.database.mongodb_connect, {
  useMongoClient: true
}, (err) => {
  if (err) console.error(err);
});
var app = express();
app.use(helmet());
app.use(compression());
app.use(cors('*'));
app.use((req, res, next) => {
  req.dbMongoose = dbMongoose;
  req.config = config;
  req.models = {
    CoinModel
  }
  next();
});

// app setup
app.set('env', 'development');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
