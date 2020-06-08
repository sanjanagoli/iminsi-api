/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow-callback */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRouter from './router';
// import createArticle from './controllers/article_controller';
// import * as Article from './controllers/article_controller';
// import * as Organization from './controllers/organization_controller';
// import * as ApiController from './controllers/api_controller';
// import * as UserController from './controllers/user_controller';
// import * as Interest from './controllers/interest_controller';


// DB Setup
require('dotenv').config(); // load environment variables

// const mongoURI = 'mongodb://localhost/iminsi';
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/iminsi';
mongoose.connect(mongoURI);
mongoose.set('useFindAndModify', false);

// mongoose.connect(mongoURI);

// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// // enable only if you want templating
// app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API, extend default size limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

// allow cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// additional init stuff should go before hitting the routing
app.use('/api', apiRouter);


// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
