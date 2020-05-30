/* eslint-disable array-callback-return */
/* eslint-disable prefer-promise-reject-errors */
import mongoose from 'mongoose';
import Article from '../models/article_model';
import RESPONSE_CODES from '../constants/index';
// import { apiCountries } from '../constants/apiDetails';

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
        console.log('populate failed');
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
        resolve(res);
      })
      .catch((err) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, err });
      });
  });
};


// have a bulk "update" method that can update the database with a bunch
