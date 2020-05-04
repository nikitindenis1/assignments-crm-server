const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const moment  = require('moment')
const ObjectID = require("mongodb").ObjectID;
const Assignment = require("../../models/Assignment");
//@route GET api/assignments
//@desc get all assignments
//@access Private


router.get("/", auth, async (req, res) => {
  try {
    let assignments = await Assignment.find({ user: req.user.id });
    if (assignments.length === 0) {
      return res.send(successfulBody([]))
    }
    assignments = assignments.sort((a, b) => moment(b.date) - moment(a.date));
   return  res.send(successfulBody(assignments))
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//@route GET api/employees
//@desc get assignment by id
//@access PRIVET
router.get("/get-by-id", auth, async (req, res) => {
    let assignment_id = req.query.id
    try {
      const assignment = await Assignment.findOne({ _id: assignment_id, user:req.user.id });
      if (!assignment) {
       return  res.send(failureBody( "Assignments not found"))
      }
      res.send(successfulBody(assignment))
    } catch (err) {
        if(err.kind == 'objectId'){
          return res.send(failureBody( "Assignments not found"))
        }
      res.status(500).send("Server Error");
    }
  });  



//@route GET api/employees
//@desc delete assignmenmt
//@access PRIVET
router.post("/delete", auth, async (req, res) => {
    let id = req.body.id
    try {
      await Assignment.findOneAndRemove({ _id: id});
      res.send(successfulBody('Assignment removed'))
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });  




//@route POST api/assignments
//@desc create or update assignment
//@access Privet

router.post("/", auth, async (req, res) => {
  const body = req.body;
  let id = new ObjectID(req.body._id);
  body.user = req.user.id;
 
  try {
    let assignment = await Assignment.findOne({ _id:id });
    if (assignment) {
        assignment = await Assignment.findOneAndUpdate(
        { _id: id},
        { $set: body },
        { new: true }
      );
      return res.send(successfulBody(assignment))
    }
    assignment = new Assignment(body);
    await assignment.save();
    return res.send(successfulBody(assignment))
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
