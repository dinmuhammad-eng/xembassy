const mysql = require('mysql');
require('dotenv').config();

let connection = mysql.createConnection({
  port: process.env.portdb,
  host: process.env.hostdb,
  user: process.env.userdb,
  password: process.env.passworddb,
  database: process.env.databasedb,
});

connection.connect((err) => {
  if (!err) {
    console.log("Connected to the database");
  } else {
    console.error("Failed to connect to the database:", err);
  }
});

module.exports = connection;
