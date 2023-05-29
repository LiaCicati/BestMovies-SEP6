/*
This module defines the router for favorite movie-related operations
*/
const router = require("express").Router();
const MovieController = require("../controllers/movie");
const { validateMovieId, validateMovie } = require("../middlewares/celebrateValidation");

router.get("/", MovieController.getMovies);
router.post("/", validateMovie, MovieController.addMovie);
router.delete("/:movieId", validateMovieId, MovieController.deleteMovie);
router.get("/:movieId", validateMovieId, MovieController.getMovieById);

module.exports = router;
