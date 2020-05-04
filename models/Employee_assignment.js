const mongoose = require("mongoose");

const EmployeeAssignment = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employee",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  files: {
    type: [
      {
        name: String,
        url: String,
      },
    ],
  },
  text: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  deadline: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: Object,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Employee = mongoose.model(
  "employee_assignment",
  EmployeeAssignment
);
