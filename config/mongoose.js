const mongoose = require("mongoose");
const db = mongoose.connection;

mongoose.connect("mongodb://localhost:27017/expense_tracker");

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("database connected");
});

module.exports = db;
