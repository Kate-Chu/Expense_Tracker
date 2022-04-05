const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Category = require("../../models/Category");
const Expense = require("../../models/Expense");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const existUser = await User.findOne({ email });
  const errors = [];

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "每個欄位都需要填寫" });
  }

  if (existUser) {
    errors.push({ message: "此使用者已經存在" });
  }

  if (password !== confirmPassword) {
    errors.push({ message: "確認密碼不一致" });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashPassword });
  return res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/users/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
