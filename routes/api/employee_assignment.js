const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
var ObjectID = require("mongodb").ObjectID;

const Employee_assignment = require("../../models/Employee_assignment");

//@route GET api/employee_assignment/get-by-employee-id
//@desc get employee assignments by employee id
//@access Private
router.get("/get-by-employee-id", auth, async (req, res) => {
  const employee_id = new ObjectID(req.query.employee_id);
  try {
    const employee_assignments = await Employee_assignment.find({
      employee_id,
    });
    return res.send(successfulBody(employee_assignments));
  } catch (error) {
    return res.send(failureBody('server error'));
  }
});

//@route GET api/employee_assignment/get-by-id
//@desc get employee assignments by id
//@access Private
router.get("/get-by-id", auth, async (req, res) => {
  const _id = new ObjectID(req.query._id);
  const employee_assignment = await Employee_assignment.findOne({ _id });
  return res.send(successfulBody(employee_assignment));
});

//@route POST api/employee_assignment
//@desc create and update employee assignments
//@access Private
router.post("/", auth, async (req, res) => {
  const { _id } = req.body;
  let body = req.body;
  const updated_at = new Date();
  let user_id = new ObjectID(req.user.id);
  body.user_id = user_id;
  body.updated_at = updated_at;
  if (_id) {
    let id = new ObjectID(_id);
    const employee_assignment = await Employee_assignment.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );
    return res.send(successfulBody(employee_assignment));
  }
  const employee_assignment = await new Employee_assignment(body);
  await employee_assignment.save();
  return res.send(successfulBody(employee_assignment));
});

router.post("/delete", auth, async (req, res) => {
  const { _id } = req.body;
  let id = new ObjectID(_id);
  try {
    await Employee_assignment.findOneAndRemove({ _id: id });
    return res.send(successfulBody());
  } catch (error) {
    console.error(error.message);
    return res.send(failureBody("Server error"));
  }
});

module.exports = router;
