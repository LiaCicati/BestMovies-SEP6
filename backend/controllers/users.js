const User = require('../models/user');

// Controller function to create a new user
const createUser = (req, res, next) => {
    // Extract the name, email, and password from the request body
    const { name, email, password } = req.body;

    // Check if the required fields are present
    if (!email || !password || !name) {
        console.log('empty');
        return;
    }

    // Search for an existing user with the same email
    User.findOne({ email })
        .then((user) => {
            // If user with the same email already exists log a message and return early
            if (user) {
                console.log('already exists');
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


module.exports = {
    createUser,
};