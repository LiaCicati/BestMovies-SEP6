const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const BadRequestError = require("../errors/BadRequestError");

const validatorURL = (url) => {
  if (!validator.isURL(url)) {
    throw new BadRequestError("The provided url is not a valid url");
  }
  return url;
};

const validateUserRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

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

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateMovie,
  validateMovieId,
  validateUserUpdate
};
