const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Category = require("../../models/Category");
const Expense = require("../../models/Expense");
const moment = require("moment");

router.get("/", async (req, res) => {
  const userId = req.user._id;
  const categories = (
    await Category.find({}, { _id: 0, category: 1 }).lean()
  ).map((item) => item.category);

  const expenses = await Expense.find({ userId })
    .populate("categoryId", "htmlClass")
    .lean();
  let totalAmount = 0;
  for await (const expense of expenses) {
    expense.date = moment(expense.date).format("YYYY-MM-DD");
    totalAmount += expense.amount;
  }
  res.render("index", {
    expenses,
    categories,
    totalAmount,
    helpers: {
      select: function (value1, value2) {
        return value1 === value2 ? "selected" : "";
      },
    },
  });
});

// 增加
router.get("/create", async (req, res) => {
  const categories = (
    await Category.find({}, { _id: 0, category: 1 }).lean()
  ).map((item) => item.category);
  res.render("create", { categories });
});

router.post("/create", async (req, res) => {
  const { name, date, category, amount } = req.body;
  if (!name || !date || !category || !amount) {
    req.flash("warning_msg", "每項資料都須要填寫哦");
    return res.render("create", { ...req.body });
  }
  const user = await User.findById(req.user._id);
  const newExpense = new Expense({
    name,
    date,
    category,
    amount,
    userId: req.user._id,
  });
  await user.expenseId.push(newExpense._id);
  await newExpense.save();
  user.save();

  const categoryDb = await Category.find({ category });
  categoryDb[0].expenseId.push(newExpense._id);
  await categoryDb[0].save();
  newExpense.categoryId = categoryDb[0]._id;
  await newExpense.save();
  res.redirect("/expenses");
});

// 修改
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const categories = (
    await Category.find({}, { _id: 0, category: 1 }).lean()
  ).map((item) => item.category);
  const expense = await Expense.findById(id).lean();
  expense.date = moment(expense.date).format("YYYY-MM-DD");

  res.render("edit", {
    expense,
    categories,
    helpers: {
      select: function (value1, value2) {
        return value1 === value2 ? "selected" : "";
      },
    },
  });
});

router.put("/:id/edit", async (req, res) => {
  const { name, date, category, amount } = req.body;
  if (!name || !date || !category || !amount) {
    req.flash("warning_msg", "每項資料都須要填寫哦");
    return res.render("edit", { ...req.body });
  }

  const { id } = req.params;
  const expense = await Expense.findById(id);
  const subCategory = req.body.category;

  if (subCategory !== expense.category) {
    const originCatDb = await Category.find({
      category: expense.category,
    });
    await originCatDb[0].expenseId.splice(
      originCatDb[0].expenseId.indexOf(expense._id),
      1
    );
    originCatDb[0].save();

    const newCatDb = await Category.find({ category: subCategory });
    newCatDb[0].expenseId.push(expense._id);
    await newCatDb[0].save();
    expense.categoryId = newCatDb[0]._id;
    await expense.save();
  }
  await Expense.findByIdAndUpdate(id, { ...req.body });

  res.redirect("/expenses");
});

// 刪除
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id).lean();
  const categoryDb = await Category.find({ category: expense.category });
  const user = await User.findById(expense.userId);

  user.expenseId.splice(user.expenseId.indexOf(expense._id), 1);
  user.save();
  categoryDb[0].expenseId.splice(
    categoryDb[0].expenseId.indexOf(expense._id),
    1
  );
  categoryDb[0].save();
  await Expense.findByIdAndDelete(id);
  res.redirect("/expenses");
});

// 分類
router.get("/select", async (req, res) => {
  const query = req.query.sort;
  const userId = req.user._id;
  const categories = (
    await Category.find({}, { _id: 0, category: 1 }).lean()
  ).map((item) => item.category);
  const expenses = await Expense.find({ category: query, userId })
    .populate("categoryId", "htmlClass")
    .lean();
  let totalAmount = 0;
  for (const expense of expenses) {
    expense.date = moment(expense.date).format("YYYY-MM-DD");
    totalAmount += expense.amount;
  }
  res.render("index", {
    query,
    expenses,
    categories,
    totalAmount,
    helpers: {
      select: function (value1, value2) {
        return value1 === value2 ? "selected" : "";
      },
    },
  });
});

module.exports = router;
