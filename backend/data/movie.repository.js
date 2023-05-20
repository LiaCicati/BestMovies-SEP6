const Movie = require("../models/movie");

class MovieRepository {
  async createMovie(movie) {
    return Movie.create(movie);
  }

  async findMovies(owner) {
    return Movie.find(owner);
  }

  async findMovieById(id) {
    return Movie.findById(id);
  }

  async deleteMovie(id) {
    return Movie.findByIdAndRemove(id);
  }
}

module.exports = MovieRepository;
