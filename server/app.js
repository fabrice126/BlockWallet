//node_modules import
import path from 'path';
import jade from 'jade';
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
import schedule from 'node-schedule';
import jwt from "jsonwebtoken";
import jwtExpress from 'express-jwt';
//Local import
import config from "./config/config";
import privateConf from './private/jwt_secret_key'
import MarketModel from './models/Market.model';
import UserModel from './models/User.model';
import api from './routes/api/api';
import login from './routes/login';
console.log("Cron is active")
// var j = schedule.scheduleJob('*/10 * * * * *', function () {
//   console.log('The answer to life, the universe, and everything!');
// });

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
  req.jwt = jwt;
  req.jwtExpress = jwtExpress;
  req.privateConf = privateConf;
  req.models = {
    MarketModel,
    UserModel
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

// app.use(jwtExpress({ secret: privateConf.jwt_private_key }).unless({ path: ['/', '/login', '/login/signup'] }));

app.get('/', (req, res, next) => {
  return res.json("ok");
});

app.use('/login', login);
app.use('/api', api);
app.get('/protected', function (req, res, next) {
  console.log("dans protected");
  console.log(req.user);
  // if (!req.user.admin) return res.sendStatus(401);
  res.json(200);
});
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
