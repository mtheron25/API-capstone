require("dotenv").config();
const express = require("express");
const router = express.Router();
const con = require("../dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER CLIENT
router.post("/", async (req, res) => {
  const { name, email, contact, password } = req.body;
  if (!name || !email || !contact || !password) {
    res.status(400).send({ msg: "Not all fields have been submitted" });
  }
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    var sql = `INSERT INTO clients (client_name, client_email, client_contact, client_password) VALUES ('${name}', '${email}', '${contact}','${hashedPassword}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.send("User created");
    });
  } catch (error) {
    res.status(500).send();
  }
});

//GET ALL CLIENTS
router.get("/", (req, res) => {
  var sql = `SELECT * FROM clients`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    // console.log("1 record inserted");
    res.send(result);
  });
});

//GET 1 (ID)
router.get("/:id", (req, res, next) => {
  var sql = `SELECT * FROM clients WHERE client_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.send(result[0]);
  });
});

// SIGN IN CLIENT

router.patch("/", (req, res) => {
  const { email, password } = req.body;
  var sql = `SELECT * FROM clients WHERE client_email='${email}'`;
  con
    .query(sql, async function (err, result) {
      const user = result[0];
      const match = await bcrypt.compare(password, result[0].user_password);
      if (match) {
        console.log(user);
        try {
          const access_token = jwt.sign(
            JSON.stringify(result[0]),
            process.env.ACCESS_TOKEN_SECRET
          );
          res.json({ jwt: access_token });
        } catch (error) {
          console.log(error);
        }
      } else {
        res.send("email and password does not match");
      }
    })
    .on("error", () => {
      res.send("Could not fetch from databse");
    });
});

// UPDATE CLIENT WITH ID
router.put("/:id", (req, res) => {
  const { name, email, contact, password } = req.body;

  let sql = `UPDATE clients SET `;

  if (name) sql += `client_name='${name}',`;
  if (email) sql = +`client_email='${email}',`;
  if (contact) sql = +`client_contact='${contact}',`;
  if (password) sql = +`client_password='${password}',`;

  if (sql.endsWith(",")) sql = sql.substring(0, sql.length - 1);

  sql = +` WHERE client_id=${req.params.id}`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    res.send(result);
  });
});

//DELETE CLIENT WITH ID
router.delete("/:id", (req, res) => {
  var sql = `DELETE FROM clients WHERE client_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted");
    res.send(result[0]);
  });
});

module.exports = router;
