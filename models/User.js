const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is Reuqired"],
  },
  email: {
    type: String,
    require: [true, "Email is required"],
  },
  password: {
    type: String,
    require: [true, "Password is reuqired"],
  },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
