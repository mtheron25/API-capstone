require("dotenv").config;
const express = require("express");
const Clients = require("../models/clients");
const authenticateToken = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getClient, getRoom } = require("../middleware/finders");
const app = express.Router();

// GET all users
app.get("/", async (req, res) => {
  try {
    const clients = await Clients.find();
    res.status(200).json({
      message: "SUCCESS",
      results: clients,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// GET one client
app.get("/single-client/", authenticateToken, async (req, res, next) => {
  try {
    const client = await Clients.findById(req.client._id);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN client with email + password
app.patch("/", async (req, res, next) => {
  const { email, password } = req.body;
  const client = await Clients.findOne({
    email,
  });

  if (!client)
    res.status(404).json({
      message: "Could not find client",
    });
  if (await bcrypt.compare(password, client.password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(client),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({
        jwt: access_token,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: "Email and password combination do not match",
    });
  }
});

// REGISTER a client
app.post("/", async (req, res, next) => {
  const { name, email, password, contact } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const client = new Clients({
    name,
    email,
    password: hashedPassword,
    contact,
  });

  try {
    const newClient = await client.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(newClient),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({
        jwt: access_token,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE a client
app.put("/", authenticateToken, async (req, res, next) => {
  const client = await Cleints.findById(req.client._id);
  const { name, email, password } = req.body;
  if (name) client.name = name;
  if (email) client.email = email;
  if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    client.password = hashedPassword;
  }
  try {
    const updatedClient = await client.save();

    try {
      const token = jwt.sign(
        JSON.stringify(updatedClient),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({ jwt: token, client: updatedClient });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    // Dont just send client as object, create a JWT and send that too.
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a client
app.delete("/:id", getClient, async (req, res, next) => {
  try {
    const client = await Clients.findById(req.client._id);
    await client.remove();
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
