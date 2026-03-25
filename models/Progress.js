const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  subject: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  score: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  streakAfterCompletion: { type: Number, default: 0 }
});

module.exports = mongoose.model("Progress", progressSchema);