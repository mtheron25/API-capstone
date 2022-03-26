const mysql = require("mysql");

const con = mysql.createConnection({
  host: "db4free.net",
  user: "manicia",
  password: "M@nici@25",
  database: "hotel_api",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
