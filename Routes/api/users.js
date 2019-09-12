const express = require("express");
const router = express.Router();
// this to validate the input
// @document npm express-validator
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// @route   GET api/users
// @desc    Register route
// @access  Public
router.post(
  "/",
  // Validate all the field
  [
    // check the name if is not empty or not
    check("name", "Name is required")
      .not()
      .isEmpty(),
    // check the email is email
    check("email", "Please include a valid email").isEmail(),
    // check the password Length
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
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

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      // check if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      /* Get users gravatar */
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      // Create a new instance
      user = new User({
        name,
        email,
        avatar,
        password
      });

      /* Encrypt password using bcrypt */
      // create the salt first

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // save the user to the database
      await user.save();

      /* Return jsonwebtoken */

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
