const express = require("express");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
var ObjectID = require("mongodb").ObjectID;
const auth = require("../../middleware/auth");
const Permission = require("../../models/Permissions");
//@route POST api/permissions
//@desc get account permissions
//@access Private
router.get("/", auth, async (req, res) => {
  const user = new ObjectID(req.query.id);
  console.log(user)
  try {
    let permissions = await Permission.findOne({ user });
    if(!permissions)  return res.send(failureBody("Permissions not found"));
   return res.send(successfulBody(permissions));
    
  } catch (error) {
    res.send(failureBody("server error"));
  }
});

//@route POST api/permissions/update
//@desc update account permissions
//@access Private

router.post("/update", auth, async (req, res) => {
  const { user_id, permissions } = req.body;
  const user = new ObjectID(user_id);
  const fileds = {
    updated_at: new Date(),
    permissions,
    user
  };
  try {
    let permission = await Permission.findOne({ user });
    console.log(permission)
    if (!permission) {
      permission = await new Permission({
        permissions,
      });
      permission.save();
      return res.send(successfulBody(permission));
    }
    permission = await Permission.findOneAndUpdate(
      { user },
      { $set: fileds },
      { new: true }
    );
   return  res.send(successfulBody(permission));
  } catch (error) {
    res.send(failureBody("Server error"));
  }
});

module.exports = router;
