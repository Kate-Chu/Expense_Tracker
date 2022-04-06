const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  index: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
