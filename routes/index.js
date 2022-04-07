const express = require("express");
const router = express.Router();

const home = require("./modules/home");
const user = require("./modules/user");
const expense = require("./modules/expense");
const auth = require("./modules/auth");
const { authenticator } = require("../middleware/auth");

router.use("/expenses", authenticator, expense);
router.use("/users", user);
router.use("/auth", auth);
router.use("/", authenticator, home);

module.exports = router;
