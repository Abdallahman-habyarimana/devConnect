const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// @route   GET api/Auth
// @desc    Test route
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Pubic
router.post(
  "/",
  // Validate all the field
  [
    // check the email is email
    check("email", "Please include a valid email").isEmail(),
    // check the password Length
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    // Declare a variable that will check the req
    const errors = validationResult(req);
    // check if the errors
    if (!errors.isEmpty()) {
      // If there is errors,
      // return bad request
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      // check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      //
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      // Declare the payload
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      // res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.get("/", (req, res) => res.send("User route"));

module.exports = router;
