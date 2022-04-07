const db = require("../../config/mongoose");
const User = require("../User");
const Expense = require("../Expense");
const Category = require("../Category");
const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
        amount: 1000,
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

const addSeedData = async () => {
  for await (let user of SEED_DATA) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = await new User({
      name: user.name,
      email: user.email,
      password: hashPassword,
    });
    await newUser.save();

    const seedExpenses = user.expense;
    for await (let expense of seedExpenses) {
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
      if (categoryDb.length) {
        categoryDb[0].expenseId.push(newExpense._id);
        await categoryDb[0].save();
        newExpense.categoryId = categoryDb[0]._id;
      } else {
        const newCategory = new Category({
          category: expense.category,
          expenseId: newExpense._id,
          htmlClass: CATEGORY[expense.category].htmlClass,
        });
        await newCategory.save();
        newExpense.categoryId = newCategory._id;
      }
      await newExpense.save();
    }
  }
};

db.once("open", async () => {
  await addSeedData();
  process.exit();
});
