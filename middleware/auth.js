require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token || token == null)
    return res.status(401).send({ message: "Client not logged in" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, client) => {
    if (err) res.status(403).send({ message: err.message });
    req.client = client;
    return next();
  });
}

module.exports = authenticateToken;
