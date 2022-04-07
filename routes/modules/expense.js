const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Category = require("../../models/Category");
const Expense = require("../../models/Expense");

const CATEGORY = {
  家居物業: {
    url: "https://fontawesome.com/icons/home?style=solid",
    htmlClass: "fa-solid fa-house",
  },
  交通出行: {
    url: "https://fontawesome.com/icons/shuttle-van?style=solid",
    htmlClass: "fa-solid fa-van-shuttle",
  },
  休閒娛樂: {
    utl: "https://fontawesome.com/icons/grin-beam?style=solid",
    htmlClass: "fa-solid fa-face-grin-beam",
  },
  餐飲食品: {
    url: "https://fontawesome.com/icons/utensils?style=solid",
    htmlClass: "fa-solid fa-utensils",
  },
  其他: {
    url: "https://fontawesome.com/icons/pen?style=solid",
    htmlClass: "fa-solid fa-pen",
  },
};

router.get("/", async (req, res) => {
  const userId = req.user._id;
  const expenses = await Expense.find({ userId })
    .populate("categoryId", "htmlClass")
    .lean();
  let totalAmount = 0;
  for await (const expense of expenses) {
    totalAmount += expense.amount;
  }
  res.render("index", { expenses, totalAmount });
});

// 增加
router.get("/create", (req, res) => {
  const categories = Object.keys(CATEGORY);
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
  if (categoryDb.length) {
    categoryDb[0].expenseId.push(newExpense._id);
    categoryDb[0].save();
    newExpense.categoryId = categoryDb[0]._id;
  } else {
    const newCategory = new Category({
      category,
      expenseId: newExpense._id,
      htmlClass: CATEGORY[category].htmlClass,
    });
    newExpense.categoryId = newCategory._id;
    await newCategory.save();
  }
  newExpense.save();
  res.redirect("/expenses");
});

// 修改
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const categories = Object.keys(CATEGORY);
  const expense = await Expense.findById(id).lean();
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
    if (newCatDb.length) {
      newCatDb[0].expenseId.push(expense._id);
      await newCatDb[0].save();
      expense.categoryId = newCatDb[0]._id;
      expense.save();
    } else {
      const newCategory = new Category({
        category: subCategory,
        expenseId: expense._id,
        iconUrl: CATEGORY[subCategory],
      });
      await newCategory.save();
      expense.categoryId = newCategory._id;
      expense.save();
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
  const query = req.query.sort;
  const userId = req.user._id;
  const expenses = await Expense.find({ category: query, userId })
    .populate("categoryId", "htmlClass")
    .lean();
  let totalAmount = 0;
  for await (const expense of expenses) {
    totalAmount += expense.amount;
  }
  res.render("index", { expenses, totalAmount });
});

module.exports = router;
