const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  backdrop_path: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  my_rating: {
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

module.exports = mongoose.model("rating", ratingSchema);
