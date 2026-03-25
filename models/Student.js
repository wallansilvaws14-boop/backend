const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, default: "", trim: true },
  totalPoints: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastCompletedDate: { type: String, default: "" }, // YYYY-MM-DD
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", studentSchema);