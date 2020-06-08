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

// const array = [{
//   id: '5ed71f531779157a29f5a769', // 5ed71f531779157a29f5a769
// }, {
//   id: '5ed71f541779157a29f5a76c', // 5ed71f541779157a29f5a76c
// }];
// const org = {
//   id: '5ed71f541779157a29f5a76c',
// };

// UserController.deleteUserOrganization('5ed9c8ea61291acba01dcdd4', org)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// UserController.addOrganizationToProfile('5ed9c8ea61291acba01dcdd4', array)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const art = {
//   id: '5ed71f511779157a29f5a763',
// };

// const art2 = {
//   id: '5ed71f531779157a29f5a76a',
// };

// Article.updateArticleScore('5ed7201e0c31f07abaad0016', 10)
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// Organization.addArticleToNewsOrganization('www.test.com', art)
//   .then((org) => {
//     console.log(org);
//     Organization.addArticleToNewsOrganization('www.test.com', art2)
//       .then((o) => {
//         console.log(o);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Organization.createOrganization((org))
//   .then((organization) => {
//     console.log(organization);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Article.getVerifiedList()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// test calls

// const { extract } = require('article-parser');
// const article = {
//   title: 'First Article',
//   tags: 'String',
//   content: 'String',
//   imageURL: 'String',
//   location: 'String',
//   urlSource: 'String2',
//   author: 'String',
//   date: 'Date',
//   score: 5,
// };

// const article2 = {
//   title: 'second Article',
//   tags: 'String',
//   content: 'String',
//   imageURL: 'bte',
//   location: 'String',
//   urlSource: 'String abcde',
//   author: 'String',
//   date: 'Date',
//   score: 4,
// };

// const article3 = {
//   title: 'third Article',
//   tags: 'String',
//   content: 'String',
//   imageURL: 'more bte',
//   location: 'String',
//   source: 'String',
//   urlSource: 'more btw',
//   author: 'String',
//   date: 'Date',
//   score: 3,
// };

// const article4 = {
//   title: 'fourth Article',
//   tags: 'String',
//   content: 'String',
//   imageURL: 'String',
//   location: 'String',
//   source: 'String',
//   urlSource: 'ok another one',
//   author: 'String',
//   date: 'Date',
//   score: 2,
// };

// const article5 = {
//   title: 'fifth Article',
//   tags: 'String',
//   content: 'String',
//   imageURL: 'String',
//   location: 'String',
//   source: 'String',
//   urlSource: 'last one',
//   author: 'String',
//   date: 'Date',
//   score: 1,
// };


// Article.createArticle((article))
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// Article.createArticle((article2))
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// Article.createArticle((article3))
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// Article.createArticle((article4))
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// Article.createArticle((article5))
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// ApiController.dailyAPICall()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Article.dailyAPICall()
//   .then((res) => {
//     console.log(res);
//     const artcls = res;
//     console.log(`here ${artcls}`);
//   });


// the response from dailAPICall is an array of objects that hold the News Api Response
//   artcls.forEach((artObject) => {
//     // array of articles in each object
//     artObject.articles.forEach((art) => {
//       const artcl = {
//         title: art.title,
//         imageURL: art.urlToImage,
//         urlSource: art.url,
//         date: new Date(art.publishedAt),
//         author: art.author || '',
//         content: '',
//       };
//       extract(art.url).then((article) => {
//         // updating the artcl with html content
//         artcl['content'] = article.content;

//         // creating new article with above fields
//         Article.createArticle(artcl)
//           .then((res) => {
//             console.log(res);
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       }).catch((err) => {
//         console.log(err);
//       });
//     });
//   });
// })
// .catch((err) => {
//   console.log(err);
// });

// const article = {
//   title: 'First Article',
//   tags: 'String',
//   content: 'String',
//   imageURL: 'String',
//   location: 'String',
//   source: 'String',
//   author: 'String',
//   date: 'Date',
// };

// const interest = {
//   interestName: 'testName1',
//   imageURL: 'testImage1',
// };

// Article.replaceArticleCategory('5ec47484d9745cd0f3dc591d', { interestCategories: ['5ec47061c52d38ae51d1130c'] })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Article.getArticles()
//   .then((res) => {
//     console.log(res[0]);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// test article

// const { extract } = require('article-parser');

// const url = 'https://www.moneyweb.co.za/news/south-africa/business-stands-behind-government-efforts-to-ease-restrictions/';
// extract(url).then((article) => {
//   console.log(article);
// }).catch((err) => {
//   console.log(err);
// });
