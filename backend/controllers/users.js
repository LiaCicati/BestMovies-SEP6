const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

// Controller function to create a new user
const createUser = (req, res, next) => {
  // Extract the name, email, and password from the request body
  const { name, email, password } = req.body;

  // Check if the required fields are present
  if (!email || !password || !name) {
    console.log("empty");
    return;
  }

  // Search for an existing user with the same email
  User.findOne({ email })
    .then((user) => {
      // If user with the same email already exists log a message and return early
      if (user) {
        console.log("already exists");
        return;
      }

      // If no user is found, create a new user with the provided details
      return User.create({
        name,
        email,
        password,
      });
    })
    .then(({ _id }) => {
      //  Send a successful response with user details
      res.status(200).send({
        _id,
        email,
        name,
      });
    })
    .catch(next);
};

/*
Get user's information
*/
const getUser = (req, res, next) => {
  // Find a user in the db based on their user ID
  User.findById(req.user._id)
    .orFail(() => {
      console.log("user not found"); // Log an error message if the user is not found
    })
    .then((user) => res.send(user)) // Send the user's information in the response
    .catch(next);
};

/*
User login
*/
const login = (req, res, next) => {
  const { email, password } = req.body;

  // Find a user with the given email and password
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        // If user credentials are valid, generate a JWT token
        const token = jwt.sign(
          { _id: user._id }, // Payload contains user ID
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret", // Secret key used for signing the token
          { expiresIn: "7d" } // Token expiration time
        );

        // Send the token in the response
        res.send({ token });
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUser,
  login,
};
