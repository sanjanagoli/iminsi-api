import mongoose, { Schema } from 'mongoose';

const InterestSchema = new Schema({
  interestName: String,
  imageURL: String,
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
  ],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create model class
const InterestModel = mongoose.model('Interest', InterestSchema);

export default InterestModel;
