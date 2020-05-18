import mongoose, { Schema } from 'mongoose';

const ArticleSchema = new Schema({
  title: String,
  tags: String,
  content: String,
  imageURL: String,
  location: String,
  source: String,
  author: String,
  date: Date,
  interestCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create model class
const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;
