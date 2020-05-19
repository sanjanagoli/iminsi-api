import mongoose, { Schema } from 'mongoose';

// find list of popular news topics / categories for interest categories
// planning to use dropdown for interest categories so that we know that the user

const ArticleSchema = new Schema({
  title: String,
  tags: String,
  content: String,
  imageURL: String,
  location: String,
  source: String,
  author: String,
  date: Date,
  interestCategories: [
    {
      interest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest',
      },
    },
  ],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
}, { collection: 'article' });

// create model class
const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;
