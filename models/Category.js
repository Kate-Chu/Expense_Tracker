const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  index: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
  },
  name: {
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
});

module.exports = mongoose.model("Category", categorySchema);
