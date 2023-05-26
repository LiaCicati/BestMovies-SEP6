const RatingRepository = require("../data/rating.repository");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const ratingRepository = new RatingRepository();
class RatingController {
  constructor(ratingRepository) {
    this.ratingRepository = ratingRepository;
  }

  addRating = (req, res, next) => {
    const { movieId, title, backdrop_path, poster_path, my_rating } = req.body;

    ratingRepository
      .findRatingByMovieTitle(title)
      .then((existingRating) => {
        if (existingRating) {
          throw new ConflictError("A rating for this movie already exists");
        } else
          return ratingRepository.createRating({
            movieId,
            title,
            backdrop_path,
            poster_path,
            my_rating,
            owner: req.user._id,
          });
      })
      .then((createdRating) => {
        res.send(createdRating);
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          next(new BadRequestError("Validation error"));
        } else {
          next(error);
        }
      });
  };

  getRatings = (req, res, next) => {
    ratingRepository
      .findRatings({ owner: req.user._id })
      .then((ratings) => {
        if (!ratings) {
          throw new NotFoundError("No ratings found");
        }
        res.send(ratings);
      })
      .catch(next);
  };

  getRatingById = (req, res, next) => {
    const { id } = req.params;
    ratingRepository
      .findRatingById(id)
      .then((rating) => {
        if (!rating) {
          throw new NotFoundError("Rating data not found");
        }
        res.send(rating);
      })
      .catch(next);
  };

  updateRating(req, res, next) {
    const { id } = req.params;
    const { my_rating } = req.body;

    ratingRepository
      .updateRatingById(id, my_rating)
      .then((rating) => {
        if (!rating) {
          throw new NotFoundError(
            "The rating you are trying to update does not exist"
          );
        }
        res.send(rating);
      })
      .catch(next);
  }
}
const ratingController = new RatingController(ratingRepository);
module.exports = ratingController;
