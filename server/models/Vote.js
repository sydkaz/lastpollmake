const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const VoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  poll: {
      type: Schema.Types.ObjectId,
      ref: 'polls'
  },
  choice: {
      type: Schema.Types.ObjectId,
      ref: 'choices'
  }
});

module.exports = Post = mongoose.model('votes', VoteSchema);
