const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { checkForbidenString } = require('../validators');

// model
const cardSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Pole name jest wymagane'],
  },
  price: {
    type: Number,
    min: 1,
    default: 1,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image: String
});
// setter
// companySchema.path('slug').set((value) => value.toLowerCase());

const Card = mongoose.model('card', cardSchema);

module.exports = Card;