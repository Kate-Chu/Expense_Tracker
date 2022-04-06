const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Category = require("../../models/Category");
const Expense = require("../../models/Expense");

const CATEGORY = {
  家居物業: "https://fontawesome.com/icons/home?style=solid",
  交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
  休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid",
};

router.get("/", async (req, res) => {
  const expenses = await Expense.find().lean();
  res.render("index", { expenses });
});

// 增加
router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", async (req, res) => {
  const { name, date, category, amount } = req.body;
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
  if (categoryDb.length) {
    categoryDb[0].expenseId.push(newExpense._id);
    categoryDb[0].save();
  } else {
    const newCategory = new Category({
      category,
      expenseId: newExpense._id,
      iconUrl: CATEGORY[category],
    });
    await newCategory.save();
  }
  res.redirect("/expenses");
});

// 修改
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id).lean();
  res.render("edit", { expense });
});

router.put("/:id/edit", async (req, res) => {
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
    if (newCatDb.length) {
      newCatDb;
    } else {
      const newCategory = new Category({
        category: subCategory,
        expenseId: expense._id,
        iconUrl: CATEGORY[subCategory],
      });
      newCategory.save();
    }
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
  const query = req.query.category;
  const userId = req.user._id;
  const expenses = await Expense.find({ category: query, userId }).lean();
  console.log(expenses);
  res.render("index", { expenses });
});

module.exports = router;
