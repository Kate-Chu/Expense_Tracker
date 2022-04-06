const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/", async (req, res) => {
  const userId = req.user._id;
  const expenses = await User.findById(userId).populate("expenseId");
  res.render("index", { expenses });
});

module.exports = router;
