const sendEmail = require("../routes/api/nodemailer");

module.exports = sendPasswordToEmployee = (email, password) => {
  let html = `
        <h2>Hi, your password is ${password}</h2>
    `;
  sendEmail(email, html);
};
