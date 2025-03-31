const moment = require("moment");
const connectToDatabase = require("../app/database-mongodb");
const User = require("./models/user.model");
class UserServie {
  async create(user) {
    console.log("create", user);
    try {
      const { username, password } = user;
      const database = await connectToDatabase();

      const now = moment();
      const formattedNow = now.format("YYYY-MM-DD HH:mm:ss");
      const newUser = new User({
        username,
        password,
        createdAt: formattedNow,
        updatedAt: formattedNow,
      });
      const savedUser = await newUser.save();
      console.log(savedUser, "insertResult");
      return savedUser;
    } catch (error) {
      console.log(error, "error");
    }
  }

  async getUserByname(username) {

    try {
      const database = await connectToDatabase();
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      console.log(error);
    }
    return result[0];
  }

  async getUserList() {
    try {
      const database = await connectToDatabase();
      const user = await User.find().select('-password');
      return user;
    } catch (error) {
      console.log(error);
    }
    return result[0];
  }
}

module.exports = new UserServie();


