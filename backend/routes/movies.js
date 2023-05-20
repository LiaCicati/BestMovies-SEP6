const router = require("express").Router();
const MovieController = require("../controllers/movie");
const { validateMovieId } = require("../middlewares/celebrateValidation");

router.get("/", MovieController.getMovies);
router.post("/", MovieController.addMovie);
router.delete("/:movieId", validateMovieId, MovieController.deleteMovie);

module.exports = router;
