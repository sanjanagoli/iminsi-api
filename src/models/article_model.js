import mongoose, { Schema } from 'mongoose';

// find list of popular news topics / categories for interest categories
// planning to use dropdown for interest categories so that we know that the user


const ArticleSchema = new Schema({
  title: String,
  tags: String,
  content: String,
  imageURL: String,
  location: String,
  summary: String,
  urlSource: String,
  author: String,
  score: Number,
  date: Date,
  newsOrganization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  interestCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interest',
    },
  ],

}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create model class
const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;
