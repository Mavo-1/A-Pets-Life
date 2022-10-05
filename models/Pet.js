const mongoose = require('mongoose')

const PetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    default: 'walk',
    enum: ['poop', 'pee','food','walk'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bornAt: {
    type: Date,
    default: Date,
  },
})

module.exports = mongoose.model('Pet', PetSchema)