/* eslint-disable prefer-promise-reject-errors */
import Article from '../models/article_model';
import { RESPONSE_CODES } from '../constants';
// var ObjectId = require('mongodb').ObjectID;

export const createArticle = (body) => {
  return new Promise((resolve, reject) => {
    Article.create({
      title: body.title,
      tags: body.tags,
      content: body.content,
      imageURL: body.imageURL,
      location: body.location,
      source: body.source,
      author: body.author,
      date: body.Date,
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
      .populate('interestCategories.interest')
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
      .populate('interestCategories.interest')
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

// have a bulk "update" method that can update the database with a bunch
