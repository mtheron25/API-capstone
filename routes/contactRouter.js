const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();

router.get("/", (req, res) =>
  res.send({ msg: "Send contact using POST" })
);
router.post("/", (req, res) => {
  const { name, email, message } = req.body;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  var mailOptions = {
    from: email,
    to: "theronmanicia27@gmail.com",
    subject: "New message from Hotel-client",
    text: `${(name, surname)} has messaged you, saying:
    
    ${message}<br> ${contact}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).send({ msg: "Email not sent!" + error });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "Message sent successfully!" });
    }
  });
});

module.exports = router;
