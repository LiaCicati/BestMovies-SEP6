/*
Custom error class for representing an Unauthorized error (HTTP 401)
*/
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
