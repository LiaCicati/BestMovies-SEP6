const { celebrate, Joi } = require('celebrate');

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }),
});

module.exports = {
  validateMovieId,
};