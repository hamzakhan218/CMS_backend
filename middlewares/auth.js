const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../config/config.env"),
});

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      "asdhashdakjshdasjasdbjasduhehjasjdsja",
      async (err, payload) => {
        try {
          if (err) {
            return res.status(401).json({ error: "Unauthorized." });
          }
          const user = await User.findOne({ _id: payload._id }).select(
            "-password"
          );
          req.user = user;
          next();
        } catch (error) {
          console.log(error);
        }
      }
    );
  } else return res.status(403).json({ error: "Forbidden" });
};
