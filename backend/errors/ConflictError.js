/*
Custom error class for representing a Conflict error (HTTP 409)
*/
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
