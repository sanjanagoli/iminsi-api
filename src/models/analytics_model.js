import mongoose, { Schema } from 'mongoose';

const AnalyticsSchema = new Schema({
// toadd when we have MVP

}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create model class
const AnalyticsModel = mongoose.model('Analytics', AnalyticsSchema);

export default AnalyticsModel;
