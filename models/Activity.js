const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["multiple_choice", "true_false", "complete"]
  },
  statement: { type: String, required: true, trim: true },
  options: [{ type: String, trim: true }],
  correctAnswer: { type: String, required: true, trim: true },
  points: { type: Number, default: 10 },
  imageUrl: { type: String, default: "", trim: true }
}, { _id: true });

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true }, // YYYY-MM-DD
  description: { type: String, default: "", trim: true },
  isActive: { type: Boolean, default: true },
  questions: { type: [questionSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);