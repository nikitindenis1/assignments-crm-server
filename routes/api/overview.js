const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const moment = require("moment");
const User = require("../../models/User");
var ObjectID = require("mongodb").ObjectID;
const Employee_assignment = require("../../models/Employee_assignment");
var _ = require("lodash");

//@route get api/overview/assignments-status
//@desc get assignment sstatus
//@access Private
router.get("/assignments", auth, async (req, res) => {
  let id = new ObjectID(req.user.id);
  try {
    let pending = await Employee_assignment.find({
      status: "pending",
      user_id: id,
    }).countDocuments();
    let in_progress = await Employee_assignment.find({
      status: "in_progress",
      user_id: id,
    }).countDocuments();
    let done = await Employee_assignment.find({
      status: "done",
      user_id: id,
    }).countDocuments();
    let assignments = {
      pending: pending,
      in_progress: in_progress,
      done: done,
    };

    return res.send(successfulBody(assignments));
  } catch (error) {
    return res.send(failureBody("server error"));
  }
});

module.exports = router;
