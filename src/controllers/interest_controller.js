/* eslint-disable prefer-promise-reject-errors */
import mongoose from 'mongoose';
import Interest from '../models/interest_model';
import RESPONSE_CODES from '../constants';

export const createInterest = (body) => {
  return new Promise((resolve, reject) => {
    Interest.exists({ interestName: body.interestName })
      .then((response) => {
        if (!response) {
          Interest.create({
            interestName: body.interestName,
            imageURL: body.imageURL,
          }).then((result) => {
            resolve(result);
          }).catch((error) => {
            reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
          });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const deleteInterest = (id) => {
  return new Promise((resolve, reject) => {
    Interest.findByIdAndDelete(id).exec()
      .then((c) => {
        resolve(c);
      }).catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const addArticleToInterest = (interestName, article) => {
  return new Promise((resolve, reject) => {
    Interest.findOneAndUpdate({ interestName }, { $addToSet: { articles: new mongoose.Types.ObjectId(article.id) } }, { new: true, upsert: true })
      .then((interest) => {
        if (interest !== null) {
          resolve(interest);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('add article to interest failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getInterests = () => {
  return new Promise((resolve, reject) => {
    Interest.find({})
      .populate({
        path: 'articles',
        model: 'Article',
      })
      .then((interests) => {
        if (interests !== null) {
          resolve(interests);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('get interests failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getInterestById = (id) => {
  return new Promise((resolve, reject) => {
    Interest.findById(id)
      .then((interest) => {
        if (interest !== null) {
          resolve(interest);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('get interest failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getInterestByName = (interestName) => {
  return new Promise((resolve, reject) => {
    Interest.findOne({ interestName })
      .then((interest) => {
        if (interest !== null) {
          resolve(interest);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        console.log('get interest by name failed');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const updateInterestImage = (id, imageURL) => {
  return new Promise((resolve, reject) => {
    Interest.findById(id).then((interest) => {
      if (imageURL != null) {
        interest.imageURL = imageURL;
      }
      interest.save().then((result) => {
        console.log(result);
        resolve(result);
      });
    }).catch((error) => {
      reject(error);
    });
  });
};
