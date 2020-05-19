import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRouter from './router';
// import createArticle from './controllers/article_controller';
import * as Article from './controllers/article_controller';
import * as Interest from './controllers/interest_controller';

// DB Setup
require('dotenv').config(); // load environment variables

console.log(process.env.MONGODB_URI);
const mongoURI = process.env.MONGODB_URI;
// mongoose.connect(mongoURI);

// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// test calls

// const article = {
//   title: 'String',
//   tags: 'String',
//   content: 'String',
//   imageURL: 'String',
//   location: 'String',
//   source: 'String',
//   author: 'String',
//   date: 'Date',
// };

const interest = {
  interestName: 'testName1',
  imageURL: 'testImage1',
};

Interest.createInterest(interest)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// Article.getArticles()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// test article

// const { extract } = require('article-parser');

// const url = "https://www.nme.com/news/gaming-news/ubisoft-is-suing-apple-and-google-over-a-rainbow-six-siege-ripoff-2670643"
// extract(url).then((article) => {
//   console.log(article);
// }).catch((err) => {
//   console.log(err);
// });
