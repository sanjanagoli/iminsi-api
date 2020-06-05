/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-promise-reject-errors */
import dotenv from 'dotenv';
import jwt from 'jwt-simple';
import mongoose from 'mongoose';
import User from '../models/user_model';
import RESPONSE_CODES from '../constants/index';
// var ObjectId = require('mongodb').ObjectID;

// t2ekdi mn hada
dotenv.config({ silent: true });

export const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({ username })
      .populate({
        path: 'interests',
        model: 'Interest',
        populate: {
          path: 'articles',
          model: 'Article',
          populate: {
            path: 'newsOrganization',
            model: 'Organization',
          },
        },
      })
      // .populate({
      //   path: 'profileArticles',
      //   model: 'Article',
      // })
      .then((user) => {
        if (user !== null) {
          resolve(user);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const signIn = (req, res, next) => {
  console.log('test');
  getUserByUsername(req.user.username)
    .then((userObj) => {
      res.send({ token: tokenForUser(req.user), user: userObj });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signUp = (req, res, next) => {
  const username = req.body.username;
  const country = req.body.country || '';
  const password = req.body.password;

  // mongo query to find if a user already exists with this username
  User.findOne({ username })
    // eslint-disable-next-line consistent-return
    .then((result) => {
      if (result) {
        return res.status(422).send('Username already exists');
      } else {
        const user = new User({
          username,
          country,
          password,
        });
        // Save the new User object
        return user.save()
          .then((result2) => {
            // return a token same as in signin
            res.send({ token: tokenForUser(result2), user: result2 });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
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
        path: 'interests.articles',
        model: 'Article',
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
          // user.firstName = body.user.firstName || user.firstName;
          // user.lastName = body.user.lastName || user.lastName;
          user.username = body.username;
          user.country = body.country || user.country;
          user.profPicture = body.profPicture || user.profPicture;
          // user.title = body.title || user.title;
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

export const addArticleToProfile = (id, article) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, { $addToSet: { profileArticles: new mongoose.Types.ObjectId(article.id) } })
      .then((user) => {
        if (user !== null) {
          resolve(user);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getProfileArticles = (id) => {
  return new Promise((resolve, reject) => {
    User.find({ id })
      .then((user) => {
        if (user !== null) {
          resolve(user.profileArticles);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};


export const addOrganizationToProfile = (id, organization) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, {
      $addToSet: {
        trustedOrganizations: {
          totalReadArticles: 0,
          totalScore: 0,
          organization: new mongoose.Types.ObjectId(organization.sourceUrl),
        },
      },
    })
      .then((user) => {
        if (user !== null) {
          resolve(user);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const addInterestToProfile = (id, interest) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, { $addToSet: { interests: new mongoose.Types.ObjectId(interest.id) } })
      .then((user) => {
        if (user !== null) {
          resolve(user);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getTrustedOrganizations = (id) => {
  return new Promise((resolve, reject) => {
    User.find({ id })
      .then((user) => {
        if (user !== null) {
          resolve(user.trustedOrganizations);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getUserInterests = (id) => {
  return new Promise((resolve, reject) => {
    User.find({ id })
      .then((user) => {
        if (user !== null) {
          resolve(user.interests);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

// have a bulk "update" method that can update the database with a bunch


// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
