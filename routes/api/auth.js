const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { successfulBody, failureBody } = require("../../tools/routing_tools");
var ObjectID = require("mongodb").ObjectID;
const User = require("../../models/User");
const Employee = require("../../models/Employee");

//@route GET api/auth
//@desc Register user
//@access PUBLIC
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/login-by-jwt", auth, async (req, res) => {
  const _id = new ObjectID(req.user.id);
  try {
    let user = await User.findOne({ _id }).select("-password");
    if (user) {
      return res.send(successfulBody(user));
    }

    let employee = await Employee.findOne({ _id }).select("-password");
    if (employee) {
      return res.send(successfulBody(employee));
    } else return res.send(failureBody("No user found"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route POST api/auth
//@desc authenticate user & get token
//@access PUBLIC
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await Employee.findOne({ email });
      if (!user) {
        return res.send(failureBody("Invalid credentials"));
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send(failureBody("Invalid credentials"));
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        let body = {
          token,
          ...user._doc,
        };
        res.send(successfulBody(body));
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});
module.exports = router;
