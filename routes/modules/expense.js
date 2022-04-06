const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Category = require("../../models/Category");
const Expense = require("../../models/Expense");

router.get("/", async (req, res) => {
  const expenses = await Expense.find().lean();
  res.render("index", { expenses });
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", async (req, res) => {
  const index = (await Expense.find()).length + 1;
  const { name, date, category, amount } = req.body;
  const user = User.findById(req.user._id);
  const newExpense = await Expense.create({
    index,
    name,
    date,
    category,
    amount,
    userId: req.user._id,
  });
  await newExpense.save();
  await user.expenseId.push(newExpense._id);
  await user.save();

  res.redirect("/expenses");
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id).lean();
  res.render("edit", { expense });
});

router.put("/:id/edit", async (req, res) => {
  const { id } = req.params;
  await Expense.findByIdAndUpdate(id, { ...req.body });
  res.redirect("/expenses");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Expense.findByIdAndDelete(id);
  res.redirect("/expenses");
});

module.exports = router;
