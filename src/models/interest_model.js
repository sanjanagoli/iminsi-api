import mongoose, { Schema } from 'mongoose';

const InterestSchema = new Schema({
  interestName: String,
  imageURL: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create model class
const InterestModel = mongoose.model('Interest', InterestSchema);

export default InterestModel;
