/*
 This module represents the RatingRepository class responsible for interacting with the rating collection in the database.
*/
const Rating = require("../models/rating");

class RatingRepository {
  constructor() {
    this.Rating = Rating;
  }

  createRating = async (rating) => {
    return this.Rating.create(rating);
  };

  findRatings = async (owner) => {
    return this.Rating.find(owner);
  };

  findRatingByMovieTitle = async (user, title) => {
    return this.Rating.findOne({ owner: user, title });
  };

  findRatingById = async (id) => {
    return this.Rating.findById(id);
  };

  updateRatingById = async (id, newRating) => {
    return this.Rating.findByIdAndUpdate(
      id,
      { my_rating: newRating },
      { new: true, runValidators: true }
    );
  };
}

module.exports = RatingRepository;
