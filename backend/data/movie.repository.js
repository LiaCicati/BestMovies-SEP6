/*
 This module represents the MovieRepository class responsible for interacting with the movie collection in the database.
*/

const Movie = require("../models/movie");

class MovieRepository {
  constructor() {
    this.Movie = Movie;
  }

  createMovie = async (movie) => {
    return this.Movie.create(movie);
  };

  findMovies = async (owner) => {
    return this.Movie.find(owner);
  };

  findMovieById = async (id) => {
    return this.Movie.findById(id);
  };

  deleteMovie = async (id) => {
    return this.Movie.findByIdAndRemove(id);
  };
}
module.exports = MovieRepository;
