const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const Employee = require("../../models/Employee");
const Employee_assignment = require("../../models/Employee_assignment");
const User = require("../../models/User");

var ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const sendPasswordToEmployee = require("../../functions/employee_functions");

//@route GET api/employees
//@desc get all employees
//@access PRIVETe

router.get("/all", auth, async (req, res) => {
  let user = new ObjectID(req.user.id);
  try {
    let employees = await Employee.aggregate([
      { $match: { user } },
      {
        $lookup: {
          from: "employee_assignments",
          localField: "_id",
          foreignField: "employee_id",
          as: "assignments",
        },
      },
      
      {
        $sort: {
          date: 1,
        },
      },
    ]);
    employees = employees.map((element) => {
      let pending = element.assignments.filter((m) => m.status === "pending").length;
      let in_progress = element.assignments.filter((m) => m.status === "in_progress").length;
      let done = element.assignments.filter((m) => m.status === "done").length;
      delete element.assignments
      delete element.password
      return {
        ...element,
        assignments_count: {
          pending,
          in_progress,
          done,
        },
      };
     
    });
    return res.send(successfulBody(employees));
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//@route GET api/employees
//@desc get employee by id
//@access PRIVETe
router.get("/get-by-id", auth, async (req, res) => {
  let employee_id = new ObjectID(req.query.id);
  try {
    let employee = await Employee.aggregate([
      { $match: { _id: employee_id } },
      {
        $lookup: {
          from: "employee_assignments",
          localField: "_id",
          foreignField: "employee_id",
          as: "assignments",
        },
      },
      {
        $sort: {
         'assignments.deadline': -1,
        },
      },
      {
        $project: {
        '_id':1,
        'name':1,
        'phone':1,
        'position':1,
        'email':1,
        'avatar':1,
        'active':1,
        'assignments':{
          'title':1,
          'deadline':1,
          'status':1,
          '_id':1,
          'employee_id':1
        }
        },
      },
 
    ]);

    if (!employee) {
      return res.send(failureBody("Employee not found"));
    }
    delete employee[0].password
   return  res.send(successfulBody(employee[0]));
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//@route GET api/employees
//@desc get employee profile
//@access Private
router.get("/get-profile", auth, async (req, res) => {
  let _id = new ObjectID(req.user.id);
  try {
    const employee = await Employee.findOne({
      _id,
    }).populate("-password");
    if (!employee) {
      return res.send(failureBody("Employee not found"));
    }
    res.send(successfulBody(employee));
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//@route GET api/employees
//@desc delete employee
//@access PRIVETe
router.post("/delete", auth, async (req, res) => {
  let employee_id = new ObjectID(req.body.id);
  let user = new ObjectID(req.user.id);
  try {
    await Employee.findOneAndRemove({ _id: employee_id, user });
    await Employee_assignment.deleteMany({employee_id})
    res.send(successfulBody("Employee removed"));
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//@route GET api/employees
//@desc create or update employee
//@access Privete

router.post("/create", auth, async (req, res) => {
  const { email,  password } = req.body;
  let user_id = new ObjectID(req.user.id);
  let body = req.body
  body.user =  user_id
  try {
    let employee = await Employee.findOne({ email});
    if (employee) {
      return res.send(failureBody("Employee already exist"));
    }
     let user  = await User.findOne({ email });
    if (user) {
      return res.send(failureBody("Employee already exist"));
    }

    employee = new Employee(body);
    // sendPasswordToEmployee(employee.email,password)
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(password, salt);
    await employee.save();
    return res.send(successfulBody(employee));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/update", auth, async (req, res) => {
  const { email, _id } = req.body;
  let user = new ObjectID(req.user.id);
  let id = new ObjectID(req.body._id);
  let body = req.body
  try {
    let email_exists = await Employee.findOne({ email, user });
    if (email_exists && email_exists._id != _id) {
      return res.send(failureBody("Email is used by other employee"));
    }
    let employee = await Employee.findOne({ _id: id });
    if (employee) {
      body.password = employee.password;
      employee = await Employee.findOneAndUpdate(
        { _id: id },
        { $set: body },
        { new: true }
      );
      return res.send(successfulBody(employee));
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


//@route post api/employees/password-reset
//@desc Change employee password
//@access Private
router.post("/reset-password", auth, async (req, res) => {
  const { password, _id } = req.body;
  let id = new ObjectID(_id);
  try {
    let employee = await Employee.findOne({ _id: id });
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(password, salt);
    await employee.save();
    res.send(successfulBody("Password changed"));
  } catch (error) {
    return res.send(failureBody("server error"));
  }
});

module.exports = router;
