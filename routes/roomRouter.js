require("dotenv").config();
const express = require("express");
const router = express.Router();
const con = require("../dbConnection");
const authenticateToken = require("../middleware/auth");

const rooms = [
  {
    id: 1,
    name: "",
    desc: "",
    price: "",
    img: "",
  },
  {
    id: 2,
    name: "",
    desc: "",
    price: "",
    img: "",
  },
  {
    id: 3,
    name: "",
    desc: "",
    price: "",
    img: "",
  },
  {
    id: 4,
    name: "",
    price: "",
    img: "",
  },
  {
    id: 5,
    name: "",
    desc: "",
    price: "",
    img: "",
  },
];

//CREATE
router.post("/", authenticateToken, (req, res) => {
  const { name, desc, price, img } = req.body;
  if (!name || !desc || !price || !img) res.sendStatus(400);

  var sql = `INSERT INTO rooms (room_name, room_desc, room_price, room_img)  VALUES ('${name}', '${desc}', '${price}', '${img}')`;
  con
    .query(sql, function (err, result) {
      res.send({ msg: "Booking created", room_id: result.insertId });
    })
    .on("error", () => res.sendStatus(400));
});

//READ ALL
router.get("/", authenticateToken, (req, res) => {
  var sql = `SELECT * FROM rooms`;
  con
    .query(sql, function (err, result) {
      res.send(result);
    })
    .on("error", () => res.send(500));
});

//READ ONE
router.get("/:id", authenticateToken, (req, res) => {
  var sql = `SELECT * FROM rooms WHERE room_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Showing 1 record");
    res.send(result[0]);
  });
});

//UPDATE
router.put("/:id", (req, res) => {
  const { name, desc, price, img } = req.body;

  let sql = `UPDATE rooms SET `;

  if (name) sql += `room_name='${name}',`;
  if (desc) sql = +`room_desc='${desc}',`;
  if (price) sql = +`room_price='${price}',`;
  if (img) sql = +`room_img='${img}',`;

  if (sql.endsWith(",")) sql = sql.substring(0, sql.length - 1);

  sql = +` WHERE room_id=${req.params.id}`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    res.send(result);
  });
});

//DELETE
router.delete("/:id", (req, res) => {
  var sql = `DELETE FROM rooms WHERE room_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted");
    res.send(result[0]);
  });
});

module.exports = router;
