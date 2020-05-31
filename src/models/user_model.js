// personal information (incl name etc)
// categories of interest

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  username: {
    type: String, unique: true, required: [true, 'cant be blank'], lowercase: true,
  },
  // cann add required: [true, "can't be blank"] to country if we want
  country: { type: String },
  password: { type: String },

  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  // each user will have a reference to specific analytics data
  // analytics: { type: mongoose.Schema.Types.ObjectId, ref: 'Analytics' },
  profileArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  trustOrganizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// eslint-disable-next-line consistent-return
UserSchema.pre('save', function beforeUserSave(next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // eslint-disable-next-line consistent-return
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    // eslint-disable-next-line consistent-return
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, result) => {
  // or callback(error) in the error case
    if (error) return callback(error);
    // return callback(null, comparisonResult) for success
    return callback(null, result);
  });
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
// curl -X POST -H "Content-Type: application/json" -d '{"username": "testusername","password": "password11"}' "http://localhost:9090/user"
