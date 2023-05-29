/*
This module defines the main router for the API endpoints
*/
const router = require("express").Router();
const {
  validateUserRegister,
  validateUserLogin,
} = require("../middlewares/celebrateValidation");
const UserController = require("../controllers/user");

const usersRouter = require("./users");
const moviesRouter = require("./movies");
const ratingsRouter = require("./ratings");
const auth = require("../middlewares/authentication");

// Set up routes for user-related operations
router.use("/users", auth, usersRouter);

// Set up routes for favorite movie-related operations
router.use("/movies", auth, moviesRouter);

// Set up routes for rating-related operations
router.use("/ratings", auth, ratingsRouter);

// Route for user registration
router.post("/signup", validateUserRegister, UserController.createUser);

// Route for user login
router.post("/signin", validateUserLogin, UserController.login);

module.exports = router;
