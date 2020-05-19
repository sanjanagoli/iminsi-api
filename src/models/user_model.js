// personal information (incl name etc)
// categories of interest

import mongoose, { Schema } from 'mongoose';

const User = new Schema({
  firstName: String,
  lastName: String,
  country: String,
  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
  profPicture: String,
  title: String,
  // each user will have a reference to specific analytics data
  analytics: { type: mongoose.Schema.Types.ObjectId, ref: 'Analytics' },
  profileArticles: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
}, { collection: 'user' });

User.set('toJSON', {
  virtuals: true,
});

const UserModel = mongoose.model('User', User);

export default UserModel;
