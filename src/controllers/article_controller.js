/* eslint-disable prefer-promise-reject-errors */
import Article from '../models/article_model';
import RESPONSE_CODES from '../constants/index';
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


// have a bulk "update" method that can update the database with a bunch
