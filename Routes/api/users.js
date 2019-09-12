const express = require("express");
const router = express.Router();
// this to validate the input
// @document npm express-validator
const { check, validationResult } = require("express-validator");
// @route   GET api/users
// @desc    Register route
// @access  Public
router.post(
  "/",
  // Validate all the field
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);
    res.send("User route");
  }
);
router.get("/", (req, res) => res.send("User route"));

module.exports = router;
