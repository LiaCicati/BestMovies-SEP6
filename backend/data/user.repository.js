const User = require("../models/user");

class UserRepository {
  async createUser(user) {
    return User.create(user);
  }

  async findUserByEmail(email) {
    return User.findOne({ email });
  }

  async findUserByEmailAndPassword(email, password) {
    return User.findOne({ email, password });
  }

  async findUserById(userId) {
    return User.findById(userId);
  }
}

module.exports = UserRepository;
