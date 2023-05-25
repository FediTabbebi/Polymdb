const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  
},
{ versionKey: false }
);




module.exports = mongoose.model('Movie', movieSchema);