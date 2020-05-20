import mongoose, { Schema } from 'mongoose';

// find list of popular news topics / categories for interest categories
// planning to use dropdown for interest categories so that we know that the user


const OrganizationSchema = new Schema({
  orgName: String,
  score: Number,
  sourceUrl: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create model class
const OrganizationModel = mongoose.model('Organization', OrganizationSchema);

export default OrganizationModel;
