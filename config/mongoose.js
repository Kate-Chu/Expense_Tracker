const mongoose = require("mongoose");
const db = mongoose.connection;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI);

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("database connected");
});

module.exports = db;
