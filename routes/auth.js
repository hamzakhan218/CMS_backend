const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const auth = require("../middlewares/auth");

require("dotenv").config({
  path: path.resolve(__dirname, "../config/config.env"),
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Please enter all the details" });

  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long." });

  if (name.length > 15)
    return res
      .status(400)
      .json({ error: "Name can only be less than 25 characters." });

  try {
    const doesUserAlreadyExists = await User.findOne({ email });

    if (doesUserAlreadyExists)
      return res.status(400).json({ error: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashPassword });

    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ error: "Please enter all the required fields!" });

  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });

  try {
    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists)
      return res.status(400).json({ error: "Invalid email or password" });

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExists.password
    );

    if (!doesPasswordMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    const payload = { _id: doesUserExists._id };

    const token = jwt.sign(payload, "asdhashdakjshdasjasdbjasduhehjasjdsja", {
      expiresIn: "1h",
    });
    const user = { ...doesUserExists._doc, password: undefined };
    return res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/me", auth, async (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});
module.exports = router;
