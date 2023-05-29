/*
This middleware handles error responses sent by the application
It sets the appropriate status code and sends an error message in the response
*/
const errorHandler = (err, req, res, next) => {
  // Extract the status code and error message from the error object
  const { statusCode = 500, message } = err;

  // Set the HTTP response status code
  res.status(statusCode);

  // Send the response with an appropriate error message
  res.send({
    message:
      statusCode === 500
        ? "Uh Oh!!! Something went wrong at our end. Don't worry, It's not you :) It's Us :( , sorry about that"
        : message,
  });

  next();
};

module.exports = errorHandler;
