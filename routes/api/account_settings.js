const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const moment = require("moment");
const ObjectID = require("mongodb").ObjectID;
const AccountSettings = require("../../models/Account_settings");

//@route GET api/account-settings
//@desc get account settings
//@access Private
router.get("/", auth, async (req, res) => {
  const user = new ObjectID(req.query.id);
  try {
    let settings = await AccountSettings.findOne({ user });
    if (!settings) return res.send(failureBody("No settings found"));
    return res.send(successfulBody(settings));
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//@route GET api/account-settings/create
//@desc get account settings
//@access Private


router.post("/update", auth, async (req, res) => {
    const user = new ObjectID(req.body.user);
    let body = req.body
   
    try {
      let settings = await AccountSettings.findOneAndUpdate(
        { user},
        { $set: body },
        { new: true }
      )
      return res.send(successfulBody(settings));
    } catch (error) {
      res.status(500).send("Server error");
    }
  });
module.exports = router;
