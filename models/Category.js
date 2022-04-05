const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
    enum: ["家居物業", "交通出行", "休閒娛樂", "餐飲食品", "其他"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  expenseId: {
    type: Schema.Types.ObjectId,
    ref: "Expense",
  },
});

module.exports = mongoose.model("Category", categorySchema);
