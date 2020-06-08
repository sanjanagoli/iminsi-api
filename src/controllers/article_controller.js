/* eslint-disable array-callback-return */
/* eslint-disable prefer-promise-reject-errors */
import mongoose from 'mongoose';
import Article from '../models/article_model';
// import User from '../models/user_model';
import RESPONSE_CODES from '../constants/index';
// import { apiCountries } from '../constants/apiDetails';

require('dotenv').config(); // load environment variables
const moment = require('moment');
// var ObjectId = require('mongodb').ObjectID;

export const createArticle = (body) => {
  return new Promise((resolve, reject) => {
    Article.exists({ urlSource: body.urlSource })
      .then((response) => {
        // only create a new article if it doesn't already exist (as identified by the url)
        if (!response) {
          Article.create({
            title: body.title,
            tags: body.tags,
            content: body.content,
            imageURL: body.imageURL,
            location: body.location,
            urlSource: body.urlSource,
            summary: body.summary,
            author: body.author,
            date: body.date || new Date(),
            score: body.score || 1,
          }).then((result) => {
            resolve(result);
          }).catch((error) => {
            console.log('error creating article');

            reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
          });
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
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
      .populate({
        path: 'newsOrganization',
        model: 'Organization',
      })
      .then((articles) => {
        if (articles !== null) {
          resolve(articles);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('get articles failed');
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
        console.log('get by id article failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const addInterestToArticle = (articleId, interest) => {
  return new Promise((resolve, reject) => {
    Article.findByIdAndUpdate(articleId, { $addToSet: { interestCategories: new mongoose.Types.ObjectId(interest.id) } })
      .then((article) => {
        if (article !== null) {
          resolve(article);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('add interest to article failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const updateArticleOrganization = (articleId, organization) => {
  return new Promise((resolve, reject) => {
    Article.findByIdAndUpdate(articleId, { newsOrganization: new mongoose.Types.ObjectId(organization.id) })
      .then((article) => {
        if (article !== null) {
          resolve(article);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('adding organization failed');
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
    Article.findByIdAndUpdate(id, { $inc: { score } })
      .then((res) => {
        // if score greater than users/4*2.5^2
        // replace with user count
        if (res.score + score > (5 * 1.5625) && res.verified === false) {
          console.log('here', res.score + score);
          Article.findByIdAndUpdate(id, { verified: true })
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject({ code: RESPONSE_CODES.INTERNAL_ERROR, err });
            });
        } else if (res.score + score < (5 * 1.5625) && res.verified === true) {
          Article.findByIdAndUpdate(id, { verified: false })
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject({ code: RESPONSE_CODES.INTERNAL_ERROR, err });
            });
        } else {
          resolve(res);
        }
      })
      .catch((err) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, err });
      });
  });
};

export const getVerifiedList = () => {
  return new Promise((resolve, reject) => {
    // populate
    getArticles()
      .then((articles) => {
        articles.sort(((a, b) => {
          let bScore = b.score;
          let aScore = a.score;

          if (b.score < 0) {
            bScore = 0;
          }
          if (a.score < 0) {
            aScore = 0;
          }

          const today = moment();
          const bDateWeight = 0.8 ** (moment(b.date).diff(today, 'days') * -1);
          const aDateWeight = 0.8 ** (moment(a.date).diff(today, 'days') * -1);

          return (bScore * b.newsOrganization.score * bDateWeight - aScore * a.newsOrganization.score * aDateWeight);
        }));
        if (articles.length < 50) {
          resolve(articles.splice(0, articles.length));
        } else {
          resolve(articles.splice(0, 50));
        }
      })
      .catch((error) => {
        console.log('in here');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};
