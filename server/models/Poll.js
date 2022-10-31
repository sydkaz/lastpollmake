const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PollSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  question: {
    type: String,
    required: true
  },
  startDate: {
      type: Date
  },
  endDate: {
      type: Date
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('polls', PollSchema);
