/*
Custom error class for representing a Not Found error (HTTP 404)
*/
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
