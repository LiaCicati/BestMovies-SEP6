const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRepository = require("../data/user.repository");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { NODE_ENV, JWT_SECRET } = process.env;
const userRepository = new UserRepository();

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /*
Creates a new user
*/
  createUser = (req, res, next) => {
    // Extract the name, email, and password from the request body
    const { name, email, password } = req.body;

    // Check if the required fields are present
    if (!email || !password || !name) {
      throw new BadRequestError("Email, password or name data is missing");
    }

    // Search for an existing user with the same email
    this.userRepository
      .findUserByEmail(email)
      .then((user) => {
        // If user with the same email already exists log a message and return early
        if (user) {
          throw new ConflictError("User with this email already exists");
        }
        return bcrypt.hash(password, 10);
      })
      .then((hash) =>
        this.userRepository
          .createUser({
            // If no user is found, create a new user with the provided details
            name,
            email,
            password: hash,
          })
          .then(({ _id }) => {
            //  Send a successful response with user details
            res.status(200).send({
              _id,
              email,
              name,
            });
          })
      )
      .catch(next);
  };

  /*
Retrieves user information
*/
  getUser = (req, res, next) => {
    // Retrieve the user's ID from the request object
    const userId = req.user._id;

    // Call the repository's method to find the user by ID
    this.userRepository
      .findUserById(userId)
      .then((user) => {
        // If no user is found, throw an error
        if (!user) {
          throw new NotFoundError("User not found");
        }

        // Send the user data in the response
        res.send(user);
      })
      .catch(next); // Pass any errors to the error handling middleware
  };

  /*
Authenticates user and generates JWT token for login
*/
  login = (req, res, next) => {
    const { email, password } = req.body;

    // Find a user with the given email and password
    return this.userRepository
      .findUserByEmailAndPassword(email, password)
      .then((user) => {
        if (!user) {
          throw new UnauthorizedError("Invalid credentials");
        } else {
          // Compare the provided password with the user's hashed password using bcrypt
          return bcrypt.compare(password, user.password).then((matched) => {
            if (!matched) {
              throw new UnauthorizedError("Invalid credentials");
            }

            // If user credentials are valid, generate a JWT token
            const token = jwt.sign(
              { _id: user._id }, // Payload contains user ID
              NODE_ENV === "production" ? JWT_SECRET : "dev-secret", // Secret key used for signing the token
              { expiresIn: "7d" } // Token expiration time
            );

            // Send the token in the response
            res.send({ token });
          });
        }
      })
      .catch(next);
  };

  /*
Updates user information
*/
  updateUser(req, res, next) {
    // Extract email and name from request body
    const { email, name } = req.body;

    // Update the user with the given ID
    userRepository
      .updateUserById(req.user._id, email, name)
      .then((user) => {
        // Check if the user exists
        if (!user) {
          // Throw an error if the user was not found
          throw new NotFoundError("User not found");
        }
        // Send the updated user as a response
        res.send(user);
      })
      .catch((err) => {
        // Handle duplicate email conflict
        if (err.code === 11000) {
          next(new ConflictError("User with this email already exists"));
        } else {
          // Pass other errors to the error handler middleware
          next(err);
        }
      });
  }
}
const userController = new UserController(userRepository);
module.exports = userController;
