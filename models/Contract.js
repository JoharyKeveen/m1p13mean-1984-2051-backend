const mongoose = require("mongoose");

const monthlyPeriodSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  payment_status: {
    type: String,
    enum: ["paid", "unpaid", "pending"],
    default: "pending",
  },
});

const ContractSchema = new mongoose.Schema(
  {
    file: { type: String, required: true },
    periods: [monthlyPeriodSchema],

      //Relations
    box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
  },{ timestamps: true });

module.exports = mongoose.model("Contract", ContractSchema);