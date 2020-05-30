/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-promise-reject-errors */
import Article from '../models/article_model';
import * as Interest from './interest_controller';
import * as Organization from './organization_controller';
import RESPONSE_CODES from '../constants/index';
import { apiCategories, apiCountries } from '../constants/apiDetails';


const NewsAPI = require('newsapi');
const { extract } = require('article-parser');

require('dotenv').config(); // load environment variables


export const dailyAPICall = () => {
  const newsapi = new NewsAPI(process.env.API_NEWS_KEY);

  // isntantiate all arrays of promises here (corresponds to api)
  const newsApiPromises = [];
  const newsApiResponses = [];
  Object.values(apiCountries.NEWS_API).map((country) => {
    console.log(country);
  });

  // overarching function promise
  return new Promise((res, rej) => {
    // handle newsapi
    newsApiPromises.push(
      new Promise((resolve, reject) => {
        apiCategories.NEWS_API.forEach((category) => {
          Object.values(apiCountries.NEWS_API).map((country) => {
            newsapi.v2.topHeadlines({
              category,
              language: 'en',
              country,
            })
              .then((response) => {
                // console.log(response);
                newsApiResponses.push(response);
                // call populate databases and give it the array of articles and the category and category
                resolve(response);
              })
              .catch((err) => {
                reject({ code: RESPONSE_CODES.API_REQUEST_FAILED, err });
              });
          });
        });
      }),
    );

    newsApiPromises.push(
      new Promise((resolve, reject) => {
        Object.values(apiCountries.NEWS_API).map((country) => {
          apiCategories.NEWS_API_Politics.forEach((politicsQuery) => {
            newsapi.v2.topHeadlines({
              q: politicsQuery,
              language: 'en',
              country,
            })
              .then((response) => {
                // console.log(response);
                newsApiResponses.push(response);
                resolve(response);
              })
              .catch((err) => {
                reject({ code: RESPONSE_CODES.API_REQUEST_FAILED, err });
              });
          });
        });
      }),
    );

    // handle other apis


    // put every api promise array into the .all function, this resolves, and rejects for daily api call
    Promise.all(newsApiPromises)
      .then(() => {
        res(newsApiResponses);
      })
      .catch((error) => {
        rej({ code: RESPONSE_CODES.API_METHOD_ERROR, error });
      });
  });
};


export const populateDatabases = (data, category, country) => {
  // the response from dailAPICall is an array of objects that hold the News Api Response
  data.articles.forEach((art) => {
    // array of articles in each object
    const artcl = {
      title: art.title,
      imageURL: art.urlToImage,
      urlSource: art.url,
      date: new Date(art.publishedAt),
      author: art.author || '',
      content: '',
    };

    extract(art.url).then((article) => {
      // updating the artcl with html content
      artcl.content = article.content;

      // creating new article with above fields
      Article.createArticle(artcl)
        .then((res) => {
          console.log(res);
          // now we should populate interest arrays and organization arrays with the added article
          populateAll(category, country, artcl);
        })
        .catch((error) => {
          console.log(error);
        });
    }).catch((err) => {
      console.log(err);
    });
  });
};


export const populateAll = (category, country, artcl) => {
  Interest.addArticleToInterest(category, artcl)
    .then((response) => {
      Article.addInterestToArticle(artcl.id, response);
    })
    .catch((err) => {
      console.log(err);
    });
  Interest.addArticleToInterest(country, artcl)
    .then((response) => {
      // adds interest to article as well
      Article.addInterestToArticle(artcl.id, response);
    })
    .catch((err) => {
      console.log(err);
    });
  const organizationBaseUrl = artcl.urlSource.substring('://', '/');
  Organization.addArticleToNewsOrganization(organizationBaseUrl, artcl)
    .then((org) => {
      // adds news organization to article based on the newly created/updated organization
      Article.updateArticleOrganization(artcl.id, org);
    })
    .catch((err) => {
      console.log(err);
    });
    
  // Organization.addArticleToNewsOrganization(organizationBaseUrl, artcl);
};
