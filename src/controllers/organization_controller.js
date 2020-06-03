/* eslint-disable prefer-promise-reject-errors */
import mongoose from 'mongoose';
import Organization from '../models/organization_model';
import RESPONSE_CODES from '../constants/index';
// var ObjectId = require('mongodb').ObjectID;


// handle for array of references to interests, articles, and analytics potentially
export const createOrganization = (body) => {
  return new Promise((resolve, reject) => {
    Organization.exists({ sourceUrl: body.sourceUrl })
      .then((response) => {
        if (!response) {
          Organization.create({
            orgName: body.orgName,
            score: 1,
            sourceUrl: body.sourceUrl,
            articles: body.articles || [],
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

export const deleteOrganization = (id) => {
  return new Promise((resolve, reject) => {
    Organization.findByIdAndDelete(id).exec()
      .then((c) => {
        resolve(c);
      }).catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const addArticleToNewsOrganization = (organizationBaseUrl, article) => {
  return new Promise((resolve, reject) => {
    Organization.exists({ sourceUrl: organizationBaseUrl })
      .then((response) => {
        if (response) {
          Organization.findOneAndUpdate({ sourceUrl: organizationBaseUrl }, { $addToSet: { articles: new mongoose.Types.ObjectId(article.id) } })
            .then((org) => {
              if (org !== null) {
                resolve(org);
              } else {
                reject({ code: RESPONSE_CODES.NOT_FOUND });
              }
            })
            .catch((error) => {
              console.log('populate failed');
              reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
            });
        } else {
          const tempArticleId = new mongoose.Types.ObjectId(article.id);
          const organization = {
            orgName: '',
            score: 0,
            sourceUrl: organizationBaseUrl,
            articles: [tempArticleId],
          };
          createOrganization(organization)
            .then((org) => {
              resolve(org);
            })
            .catch((error) => {
              reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
            });
        }
      })
      .catch((error) => {
        console.log('doesnt exist');
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const getOrganizations = () => {
  return new Promise((resolve, reject) => {
    Organization.find({})
      .then((orgs) => {
        if (orgs !== null) {
          resolve(orgs);
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

export const getOrganization = (id) => {
  return new Promise((resolve, reject) => {
    Organization.findById({ id })
      .then((org) => {
        if (org !== null) {
          resolve(org);
        } else {
          reject({ code: RESPONSE_CODES.NOT_FOUND });
        }
      })
      .catch((error) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, error });
      });
  });
};

export const updateOrganization = (id, body) => {
  return new Promise((resolve, reject) => {
    Organization.findById(id)
      .then((org) => {
        if (body.org != null) {
          org.orgName = body.org.orgName;
          org.score = body.org.score;
          org.sourceUrl = body.org.sourceUrl;
          org.save().then((result) => {
            resolve(result);
          }).catch((error) => {
            reject({ code: RESPONSE_CODES.BAD_REQUEST, error });
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


export const updateOrganizationScore = (id, score) => {
  return new Promise((resolve, reject) => {
    Organization.findByIdAndUpdate({ _id: id }, { $inc: { score } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject({ code: RESPONSE_CODES.INTERNAL_ERROR, err });
      });
  });
};
