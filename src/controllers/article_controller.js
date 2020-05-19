import Article from '../models/article_model';
// import { RESPONSE_CODES } from '../constants';
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
      reject(error);
    });
  });
};

export const deleteArticle = (id) => {
  return new Promise((resolve, reject) => {
    Article.findByIdAndDelete(id).exec()
      .then((c) => {
        resolve(c);
      }).catch((error) => {
        reject(error);
      });
  });
};

export const getArticles = () => {
  return new Promise((resolve, reject) => {
    Article.findById({})
      .populate('interestCategories.interest')
      .then((articles) => {
        if (articles !== null) {
          resolve(articles);
        } else {
          reject(new Error('could not find'));
        }
      })
      .catch((error) => {
        console.log('populate failed');
        reject(error);
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
          reject(new Error('could not find'));
        }
      })
      .catch((error) => {
        console.log('populate failed');
        reject(error);
      });
  });
};
