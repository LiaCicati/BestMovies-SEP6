/*
This module exports validation middleware using the 'celebrate' library
*/

const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const BadRequestError = require("../errors/BadRequestError");

// Custom validator function for URL validation
const validatorURL = (url) => {
  if (!validator.isURL(url)) {
    throw new BadRequestError("The provided url is not a valid url");
  }
  return url;
};

// Validation schema for user registration
const validateUserRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
});

// Validation schema for user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

// Validation schema for movie creation
const validateMovie = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    release_date: Joi.string().required(),
    original_language: Joi.string().required(),
    popularity: Joi.number().required(),
    overview: Joi.string().required(),
    vote_average: Joi.number().required(),
    poster_path: Joi.string().required().custom(validatorURL),
    backdrop_path: Joi.string().required().custom(validatorURL),
    movieId: Joi.number().required(),
  }),
});

// Validation schema for movie ID parameter
const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }),
});

// Validation schema for user update
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

// Validation schema for rating creation
const validateRating = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    my_rating: Joi.number().required().min(0).max(10),
    backdrop_path: Joi.string().required().custom(validatorURL),
    poster_path: Joi.string().required().custom(validatorURL),
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateMovie,
  validateMovieId,
  validateUserUpdate,
  validateRating,
};
