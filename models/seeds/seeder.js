const db = require("../../config/mongoose");
const User = require("../User");
const Expense = require("../Expense");
const Category = require("../Category");
const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const CATEGORY = require("./category_data").results;

const SEED_DATA = [
  {
    name: "Mary",
    email: "mary@example.com",
    password: "123",
    expense: [
      {
        name: "HR",
        date: "2022-03-17",
        category: "家居物業",
        amount: 5299,
      },
      {
        name: "加油",
        date: "2022-03-21",
        category: "交通出行",
        amount: 1500,
      },
      {
        name: "燒肉",
        date: "2022-04-07",
        category: "餐飲食品",
        amount: 1999,
      },
    ],
  },
  {
    name: "Marc",
    email: "marc@example.com",
    password: "123",
    expense: [
      {
        name: "麥當勞",
        date: "2022-03-17",
        category: "餐飲食品",
        amount: 149,
      },
      {
        name: "Katia birthday",
        date: "2022-03-21",
        category: "餐飲食品",
        amount: 1999,
      },
      {
        name: "TSMC stock",
        date: "2022-03-21",
        category: "其他",
        amount: 11200,
      },
    ],
  },
];

const addCategoryDate = async () => {
  for (const item of CATEGORY) {
    const newCategory = new Category({
      category: item.title,
      htmlClass: item.htmlClass,
    });
    await newCategory.save();
  }
};

const addSeedData = async () => {
  for (const user of SEED_DATA) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = await new User({
      name: user.name,
      email: user.email,
      password: hashPassword,
    });
    await newUser.save();

    const seedExpenses = user.expense;
    for (const expense of seedExpenses) {
      const newExpense = new Expense({
        name: expense.name,
        date: expense.date,
        category: expense.category,
        amount: expense.amount,
        userId: newUser._id,
      });
      await newExpense.save();
      newUser.expenseId.push(newExpense._id);
      await newUser.save();

      const categoryDb = await Category.find({ category: expense.category });
      categoryDb[0].expenseId.push(newExpense._id);
      await categoryDb[0].save();
      newExpense.categoryId = categoryDb[0]._id;
      await newExpense.save();
    }
  }
};

db.once("open", async () => {
  await addCategoryDate();
  await addSeedData();
  process.exit();
});
