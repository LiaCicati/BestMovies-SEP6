const User = require("../models/user");

class UserRepository {
  async createUser(user) {
    return User.create(user);
  }

  async findUserByEmail(email) {
    return User.findOne({ email });
  }

  async findUserByEmailAndPassword(email, password) {
    return User.findOne({ email }).select("+password");
  }

  async findUserById(userId) {
    return User.findById(userId);
  }

  async updateUserById(userId, email, name) {
    return User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true }
    );
  }
}

module.exports = UserRepository;
