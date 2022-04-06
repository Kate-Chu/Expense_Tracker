const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ["家居物業", "交通出行", "休閒娛樂", "餐飲食品", "其他"],
  },
  expenseId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  iconUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
