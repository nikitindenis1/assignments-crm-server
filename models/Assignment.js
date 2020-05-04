const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  text: {
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
  date: {
    type: Date,
    default: Date.now,
  }
});
module.exports = Employee = mongoose.model("assignment", AssignmentSchema);
