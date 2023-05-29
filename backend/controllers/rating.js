const RatingRepository = require("../data/rating.repository");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const ratingRepository = new RatingRepository();
class RatingController {
  constructor(ratingRepository) {
    this.ratingRepository = ratingRepository;
  }

  /*
Adds a rating for a movie
*/
  addRating = (req, res, next) => {
    const { movieId, title, backdrop_path, poster_path, my_rating } = req.body;
    const userId = req.user._id;

    // Check if a rating for this movie and user already exists
    ratingRepository
      .findRatingByMovieTitle(userId, title)
      .then((existingRating) => {
        if (existingRating) {
          throw new ConflictError(
            "A rating for this movie already exists for the current user"
          );
        } else {
          // Create a new rating with the provided details and user ID
          return ratingRepository.createRating({
            movieId,
            title,
            backdrop_path,
            poster_path,
            my_rating,
            owner: userId,
          });
        }
      })
      .then((createdRating) => {
        // Send the created rating as a response
        res.send(createdRating);
      })
      .catch((error) => {
        // Handle validation errors
        if (error.name === "ValidationError") {
          next(new BadRequestError("Validation error"));
        } else {
          // Pass other errors to the error handling middleware
          next(error);
        }
      });
  };

  /*
Gets all ratings of the current user
*/
  getRatings = (req, res, next) => {
    // Retrieve ratings for the current user
    ratingRepository
      .findRatings({ owner: req.user._id })
      .then((ratings) => {
        // Check if ratings were found
        if (!ratings) {
          throw new NotFoundError("No ratings found");
        }
        // Send the ratings as a response
        res.send(ratings);
      })
      .catch(next);
  };

  /*
Gets a rating by its ID
*/
  getRatingById = (req, res, next) => {
    const { id } = req.params;
    // Find a rating by its ID
    ratingRepository
      .findRatingById(id)
      .then((rating) => {
        // Check if the rating was found
        if (!rating) {
          throw new NotFoundError("Rating data not found");
        }
        // Send the rating as a response
        res.send(rating);
      })
      .catch(next);
  };

  /*
Updates a rating
*/
  updateRating(req, res, next) {
    const { id } = req.params;
    const { my_rating } = req.body;

    // Update the rating with the provided ID and new rating value
    ratingRepository
      .updateRatingById(id, my_rating)
      .then((rating) => {
        // Check if the rating exists
        if (!rating) {
          throw new NotFoundError(
            "The rating you are trying to update does not exist"
          );
        }
        // Send the updated rating as a response
        res.send(rating);
      })
      .catch(next);
  }
}
const ratingController = new RatingController(ratingRepository);
module.exports = ratingController;
