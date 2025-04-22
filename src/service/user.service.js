const db = require("../app/database-mongodb");
const User = require("./models/user.model");

class UserService {
  constructor() {
    this.connectPromise = db.instance.connect().catch((error) => {
      console.error("Database connection initialization error:", error);
      throw error;
    });

    this.create = this.create.bind(this);
    this.getUserByname = this.getUserByname.bind(this);
    this.getUserList = this.getUserList.bind(this);
  }

  async ensureConnected() {
    await this.connectPromise;
    if (!db.isConnected()) {
      throw new Error("Database connection failed");
    }
  }

  async create(user) {
    console.log("create", user);
    try {
      const { username, password } = user;
      await this.ensureConnected();

      const timestamp = new Date().toISOString();
      const newUser = new User({
        username,
        password,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      const savedUser = await newUser.save();
      console.log(savedUser, "insertResult");
      return savedUser;
    } catch (error) {
      console.log(error, "error");
      throw new Error("Failed to create user");
    }
  }

  async getUserByname(username) {
    try {
      await this.ensureConnected();
      const user = await User.findOne({ username });
      console.log(user, 'username')
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get user by name");
    }
  }

  async getUserList() {
    try {
      await this.ensureConnected();
      const users = await User.find().select('-password');
      return users;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get user list");
    }
  }
}

module.exports = new UserService();    