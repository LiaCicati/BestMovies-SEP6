const MovieRepository = require("../data/movie.repository");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

const movieRepository = new MovieRepository();
class MovieController {
  constructor(movieRepository) {
    this.movieRepository = movieRepository;
  }

  /*
Adds a new movie to the collection
*/
  addMovie = (req, res, next) => {
    // Extract data from request body
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

    // Create a new movie
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
        // Send the created movie as a response
        res.send(movie);
      })
      .catch((err) => {
        // Handle validation errors
        if (err.name === "ValidationError") {
          next(new BadRequestError("Validation error"));
        }
        // Pass other errors to the error handler middleware
        next(err);
      });
  };

  /*
 Retrieve movies owned by the authenticated user
*/
  getMovies = (req, res, next) => {
    // Retrieve movies owned by the authenticated user
    this.movieRepository
      .findMovies({ owner: req.user._id })
      .then((movies) => {
        // Check if movies were found
        if (!movies) {
          // Throw an error if no movies were found
          throw new NotFoundError("No movies found");
        }
        // Send the found movies as a response
        res.send(movies);
      })
      .catch(next);
  };

  /*
Deletes a movie from the collection
*/
  deleteMovie = (req, res, next) => {
    const { movieId } = req.params;
    const owner = req.user._id;

    // Find the movie by ID
    this.movieRepository
      .findMovieById(movieId)
      .then((movie) => {
        // Check if the movie exists
        if (!movie) {
          // Throw an error if the movie was not found
          throw new NotFoundError("Movie not found");
        }
        // Check if the authenticated user owns the movie
        if (movie.owner.toString() !== owner) {
          // Throw an error if the user is not authorized to delete the movie
          throw new ForbiddenError("You cannot delete the movie");
        }
        // Delete the movie
        return this.movieRepository.deleteMovie(movieId);
      })
      .then((movie) => res.send(movie))
      .catch(next);
  };

  /*
Retrieves a movie by its ID
*/
  getMovieById = (req, res, next) => {
    const { movieId } = req.params;

    // Find the movie by ID
    this.movieRepository
      .findMovieById(movieId)
      .then((movie) => {
        // Check if the movie exists
        if (!movie) {
          // Throw an error if the movie was not found
          throw new NotFoundError("Movie not found");
        }
        // Send the found movie as a response
        res.send(movie);
      })
      .catch(next);
  };
}
const movieController = new MovieController(movieRepository);
module.exports = movieController;
