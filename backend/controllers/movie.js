const MovieRepository = require("../data/movie.repository");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

const movieRepository = new MovieRepository();
class MovieController {
  constructor(movieRepository) {
    this.movieRepository = movieRepository;
  }

  addMovie = (req, res, next) => {
    const {
      movieId,
      title,
      release_date,
      original_language,
      popularity,
      overview,
      poster_path,
      backdrop_path,
      vote_average,
    } = req.body;
    return this.movieRepository
      .createMovie({
        movieId,
        title,
        release_date,
        original_language,
        popularity,
        overview,
        poster_path,
        backdrop_path,
        vote_average,
        owner: req.user._id,
      })
      .then((movie) => {
        if (!movie) {
          throw new NotFoundError("Movie not found");
        } else {
          res.send(movie);
        }
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError("Validation error"));
        }
        next(err);
      });
  };

  getMovies = (req, res, next) => {
    this.movieRepository
      .findMovies({ owner: req.user._id })
      .then((movies) => {
        if (!movies) {
          throw new NotFoundError("No movies found");
        }
        res.send(movies);
      })
      .catch(next);
  };

  deleteMovie = (req, res, next) => {
    const { movieId } = req.params;
    const owner = req.user._id;
    this.movieRepository
      .findMovieById(movieId)
      .then((movie) => {
        if (!movie) {
          throw new NotFoundError("Movie not found");
        }
        if (movie.owner.toString() !== owner) {
          throw new ForbiddenError("You cannot delete the movie");
        }
        return this.movieRepository.deleteMovie(movieId);
      })
      .then((movie) => res.send(movie))
      .catch(next);
  };
}
const movieController = new MovieController(movieRepository);
module.exports = movieController;
