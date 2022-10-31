const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ChoiceSchema = new Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'polls'
  },
  choicetext: {
    type: String,
    required: true
  }
});

module.exports = Post = mongoose.model('choices', ChoiceSchema);
