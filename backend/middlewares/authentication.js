/*
 Authentication Middleware that validates the authentication token 
 to determine if the user is authorized to access certain routes.
*/

const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

// Function to extract the token from the authorization header
const extractBearerToken = (header) => header.replace("Bearer ", "");

// Middleware function to validate and decode the JWT token
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the authorization header exists
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("something is wrong with the token");
  }

  // Extract the token from the authorization header
  const token = extractBearerToken(authorization);
  let payload;

  try {
    // Verify the token
    payload = jwt.verify(
      token,
      `${NODE_ENV === "production" ? JWT_SECRET : "dev-secret"}`
    );
  } catch (err) {
    console.log("you have to be authorized");
  }

  // Assign the decoded token to the 'user' property of the request object
  req.user = payload;

  next();
};
