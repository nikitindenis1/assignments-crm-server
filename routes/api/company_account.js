const express = require("express");
const router = express.Router();
const { successfulBody, failureBody } = require("../../tools/routing_tools");
const Company = require("../../models/Company");


//@route POST api/company
//@desc create company account
//@access PUBLIC
router.post("/create",  async (req, res) => {
  const { name } = req.body;
  try {
    let company = await Company.findOne({ name });
    if (company) {
      return res.send(failureBody("Company already exists"));
    }
     company  = new Company({
      name
    });
    await company.save();
    res.send(successfulBody(company._id));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});


module.exports = router;
