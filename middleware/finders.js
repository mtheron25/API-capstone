const Clients = require("../models/clients");
const Rooms = require("../models/rooms");

async function getClient(req, res, next) {
  let client;
  try {
    client = await Clients.findById(req.params.id);

    if (!client) res.status(404).json({ message: "Could not find client" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.client = client;
  next();
}

async function getRoom(req, res, next) {
  let room;
  try {
    room = await Rooms.findById(req.params.id);
    if (!room) res.status(404).json({ message: "Could not find room" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.room = room;
  next();
}

module.exports = { getClient, getRoom };
