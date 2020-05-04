const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { successfulBody, failureBody } = require("../../tools/routing_tools");
var ObjectID = require("mongodb").ObjectID;
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Permission = require("../../models/Permissions");
const AccountSettings = require("../../models/Account_settings");

//@route POST api/users
//@desc Register user
//@access PUBLIC

router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.send(failureBody("User already exists"));
    }
    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    let settings = await new AccountSettings({
      user: user.id,
    });
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
          name: user.name,
          is_manager: user.is_manager,
          _id: user.id,
        };

        settings.save();
        res.send(successfulBody(body));
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route POST api/users/update
//@desc update user
//@access Private

router.post("/update", auth, async (req, res) => {
  let _id = new ObjectID(req.user.id);
  const { name, email, avatar, phone, position } = req.body;
  const UserFileds = {
    name,
    email,
    avatar,
    phone,
    position,
  };
  try {
    let email_exist = await User.findOne({ email });
    if (email_exist && req.user.id != email_exist._id) {
      return res.send(failureBody("Email already taken"));
    }
    let user = await User.findOneAndUpdate(
      { _id },
      { $set: UserFileds },
      { new: true }
    );
    await user.save();
    res.send(successfulBody(user));
  } catch (error) {
    res.send(failureBody("Couldnt change password"));
  }
});

//@route POST api/users/reset-password
//@desc Reset user password
//@access Private

router.post("/reset-password", auth, async (req, res) => {
  let _id = new ObjectID(req.user.id);
  const { password } = req.body;

  try {
    let user = await User.findOne({ _id });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.send(successfulBody("Password updated"));
    }
  } catch (error) {
    res.send(failureBody("Couldnt change password"));
  }
});

router.get("/get-profile", auth, async (req, res) => {
  let _id = new ObjectID(req.user.id);
  try {
    let user = await User.findOne({ _id }).select("-password");
    if (!user) {
      return res.send(failureBody("User not found"));
    }
    return res.send(successfulBody(user));
  } catch (error) {
    return res.send(failureBody("User not found"));
  }
});

module.exports = router;
