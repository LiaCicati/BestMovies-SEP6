const Rating = require("../models/rating");

class RatingRepository {
  async createRating(rating) {
    return Rating.create(rating);
  }

  async findRatings(owner) {
    return Rating.find(owner);
  }

  async findRatingByMovieTitle(title) {
    return Rating.findOne({ title });
  }

  async findRatingById(id) {
    return Rating.findById(id);
  }

  async updateRatingById(id, newRating) {
    return Rating.findByIdAndUpdate(
      id,
      { my_rating : newRating },
      { new: true, runValidators: true }
    );
  }
}

module.exports = RatingRepository;
