const express = require("express");
const connetctDB = require("./config/db");
const app = express();
var cors = require("cors");
const fileUpload = require("express-fileupload");
const users_route = require("./routes/api/users");
const auth_auth = require("./routes/api/auth");
const assignment_route = require("./routes/api/assignment");
const employee_assignment_route = require("./routes/api/employee_assignment");
const employee_route = require("./routes/api/employee");
const overview_route = require("./routes/api/overview");
const files_route = require("./routes/api/files");
const company_account_route = require("./routes/api/company_account");
const permissions_route = require("./routes/api/permissions");
const account_settings = require("./routes/api/account_settings");

//Connect Database
connetctDB();
//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.get("/", (req, res) => res.send("API RUNNING"));

//Define routes

app.use("/api/users", users_route);
app.use("/api/auth", auth_auth);
app.use("/api/assignment", assignment_route);
app.use("/api/employee_assignment", employee_assignment_route);
app.use("/api/employee", employee_route);
app.use("/api/overview", overview_route);
app.use("/api/files", files_route);
app.use("/api/company-account", company_account_route);
app.use("/api/permissions", permissions_route);
app.use("/api/account-settings", account_settings);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
