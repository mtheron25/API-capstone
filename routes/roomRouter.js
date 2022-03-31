require("dotenv").config();
const express = require("express");
const rooms = require("../models/rooms");
const authenticateToken = require("../middleware/auth");
const { getRoom } = require("../middleware/finders");
const app = express.Router();

// GET all rooms
app.get("/", authenticateToken, async (req, res) => {
  try {
    const room = await rooms.find();
    res.status(201).send(room);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// GET one room
app.get("/:id", [authenticateToken, getRoom], (req, res, next) => {
  res.send(res.room);
});

// CREATE a room
app.post("/", authenticateToken, async (req, res, next) => {
  const { name, desc, price, img } = req.body;
  let room;
  img
    ? (room = new rooms({
        name,
        desc,
        price,
        img,
        created_by: req.client._id,
      }))
    : (room = new rooms({
        name,
        desc,
        price,
        img,
        created_by: req.client._id,
      }));

  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a room
app.put("/:id", [authenticateToken, getRoom], async (req, res, next) => {
  res
    .status(400)
    .json({ message: "You do not have the permission to update this room" });
  const { name, desc, price, img } = req.body;
  if (name) res.room.name = name;
  if (desc) res.room.desc = desc;
  if (price) res.room.price = price;
  if (img) res.room.img = img;
  try {
    const updatedRoom = await res.room.save();
    res.status(201).send(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a room
app.delete("/:id", [authenticateToken, getRoom], async (req, res, next) => {
  if (req.user._id !== req.product.created_by)
    res
      .status(400)
      .json({ message: "You do not have the permission to delete this product" });
  try {
    await res.product.remove();
    res.status(201).json({ message: "Deleted product" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const room = [
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
app.post("/", authenticateToken, (req, res) => {
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
app.get("/", authenticateToken, (req, res) => {
  var sql = `SELECT * FROM rooms`;
  con
    .query(sql, function (err, result) {
      res.send(result);
    })
    .on("error", () => res.send(500));
});

//READ ONE
app.get("/:id", authenticateToken, (req, res) => {
  var sql = `SELECT * FROM rooms WHERE room_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Showing 1 record");
    res.send(result[0]);
  });
});

//UPDATE
app.put("/:id", (req, res) => {
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
app.delete("/:id", (req, res) => {
  var sql = `DELETE FROM rooms WHERE room_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted");
    res.send(result[0]);
  });
});

module.exports = app;
