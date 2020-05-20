/* eslint-disable prefer-promise-reject-errors */
import User from '../models/user_model';
import RESPONSE_CODES from '../constants/index';
// var ObjectId = require('mongodb').ObjectID;


// handle for array of references to interests, articles, and analytics potentially
export const createUser = (body) => {
  return new Promise((resolve, reject) => {
    User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      country: body.country,
      profPicture: body.profPicture,
      title: body.title,
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
    });
  });
};

export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndDelete(id).exec()
      .then((c) => {
        resolve(c);
      }).catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    User.find({})
      .populate({
        path: 'interests',
        model: 'Interest',
      })
      .populate({
        path: 'profileArticles',
        model: 'Article',
      })
      .then((users) => {
        if (users !== null) {
          resolve(users);
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

export const getUser = (id) => {
  return new Promise((resolve, reject) => {
    User.findById({ id })
      .populate({
        path: 'interests',
        model: 'Interest',
      })
      .populate({
        path: 'profileArticles',
        model: 'Article',
      })
      .then((user) => {
        if (user !== null) {
          resolve(user);
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

export const updateUser = (id, body) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then((user) => {
        if (body.user != null) {
          user.firstName = body.user.firstName || user.firstName;
          user.lastName = body.user.lastName || user.lastName;
          user.country = body.user.country || user.country;
          user.profPicture = body.user.profPicture || user.profPicture;
          user.title = body.user.title || user.title;
          user.save().then((result) => {
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

// have a bulk "update" method that can update the database with a bunch
