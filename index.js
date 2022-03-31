require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const clientRouter = require("./routes/clientRouter");
const roomRouter = require("./routes/roomRouter");
const contactRouter = require("./routes/contactRouter");

app.set("port", process.env.PORT || 6969);
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.get("/", (req, res) => {
  res.send({ success: 1, msg: "Welcome to my API" });
});

app.use("/clients", clientRouter);
app.use("/rooms", roomRouter);
app.use("/contact", contactRouter);

app.listen(app.get("port"), (server) => {
  console.log(`Server listening on port ${app.get("port")}`);
  console.log("Press CTRL+C to quit");
});
