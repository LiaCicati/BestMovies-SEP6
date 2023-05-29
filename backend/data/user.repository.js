/*
 This module represents the UserRepository class responsible for interacting with the user collection in the database.
*/
const User = require("../models/user");

class UserRepository {
  constructor() {
    this.User = User;
  }

  createUser = async (user) => {
    return this.User.create(user);
  };

  findUserByEmail = async (email) => {
    return this.User.findOne({ email });
  };

  findUserByEmailAndPassword = async (email, password) => {
    return this.User.findOne({ email }).select("+password");
  };

  findUserById = async (userId) => {
    return this.User.findById(userId);
  };

  updateUserById = async (userId, email, name) => {
    return this.User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true }
    );
  };
}

module.exports = UserRepository;
