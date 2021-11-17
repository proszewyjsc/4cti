const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { checkForbidenString } = require('../validators');

// model
const shopSchema = new Schema({
  des: {
    type: String,
    required: [true, 'Pole slug jest wymagane'],
    minLength: [3, 'Minimalna liczba znaków to 3'],
    validate: value => checkForbidenString(value, 'slug'),
    trim: true,
    lowercase: true,
  },
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

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;