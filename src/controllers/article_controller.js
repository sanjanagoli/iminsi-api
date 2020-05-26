/* eslint-disable prefer-promise-reject-errors */
import Article from '../models/article_model';
import RESPONSE_CODES from '../constants/index';
import { apiCategories, apiCountries } from '../constants/apiDetails';
// import { apiCountries } from '../constants/apiDetails';

const NewsAPI = require('newsapi');

require('dotenv').config(); // load environment variables

// var ObjectId = require('mongodb').ObjectID;

export const createArticle = (body) => {
  return new Promise((resolve, reject) => {
    Article.create({
      title: body.title,
      tags: body.tags,
      content: body.content,
      imageURL: body.imageURL,
      location: body.location,
      urlSource: body.urlSource,
      author: body.author,
      date: body.date,
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
    });
  });
};

export const deleteArticle = (id) => {
  return new Promise((resolve, reject) => {
    Article.findByIdAndDelete(id).exec()
      .then((c) => {
        resolve(c);
      }).catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getArticles = () => {
  return new Promise((resolve, reject) => {
    Article.find({})
      .populate({
        path: 'interestCategories',
        model: 'Interest',
      })
      .then((articles) => {
        if (articles !== null) {
          resolve(articles);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('populate failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getArticle = (id) => {
  return new Promise((resolve, reject) => {
    Article.findById({ id })
      .populate({
        path: 'interestCategories',
        model: 'Interest',
      })
      .then((article) => {
        if (article !== null) {
          resolve(article);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('populate failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const replaceArticleInterestCategory = (id, body) => {
  return new Promise((resolve, reject) => {
    Article.findById(id)
      .then((article) => {
        if (body != null) {
          article.interestCategories = body.interestCategories;
          article.save().then((result) => {
            resolve(result);
          }).catch((error) => {
            reject({ code: RESPONSE_CODES.BAD_REQUEST });
          });
        } else {
          reject({ code: RESPONSE_CODES.NOTHING_TO_UPDATE });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateArticleScore = (id, score) => {
  return new Promise((resolve, reject) => {
    Article.findByIdAndUpdate({ _id: id }, { $inc: { score } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, err });
      });
  });
};


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


// have a bulk "update" method that can update the database with a bunch
