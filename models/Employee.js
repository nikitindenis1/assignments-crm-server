const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  avatar:{
    type:String
  },
  assignments_count: {
    type: Object,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default:true
  },
  email: {
    type: String,
    required: true,
  },
  position: {
    type: String,
  
  },
  phone: {
    type: Number,
  
  },
  assignments:{
    type:[]
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

EmployeeSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }
module.exports = Employee = mongoose.model("employee", EmployeeSchema);
