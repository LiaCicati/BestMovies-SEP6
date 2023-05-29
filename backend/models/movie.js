/*
 This module defines the movie schema using Mongoose
 It exports a Mongoose model for the 'movie' collection in the database
*/
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  original_language: {
    type: String,
    required: true,
  },
  popularity: {
    type: Number,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  backdrop_path: {
    type: String,
    required: true,
  },
  vote_average: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("movie", movieSchema);
