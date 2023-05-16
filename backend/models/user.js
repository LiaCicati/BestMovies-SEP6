const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        select: false,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
});

// Find a user by their email and password
function findUserByCredentials(email, password) {
    // Find a user with the given email and select the password to be returned
    return this.findOne({ email }).select('+password')
      .then((user) => {
        // If no user was found with the given email, show error
        if (!user) {
          console.log('incorrect email or password');
          return;
        }
  
        // If the user's stored password does not match the provided password, show error
        if (user.password !== password) {
          console.log('incorrect password');
          return;
        }
  
        // If valid credentials, return the user
        return user;
      });
  }
  
  // Assign the findUserByCredentials function to the statics object of the userSchema
  userSchema.statics.findUserByCredentials = findUserByCredentials;
  

module.exports = mongoose.model('user', userSchema);