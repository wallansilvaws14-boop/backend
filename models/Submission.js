const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  answer: { type: String, default: "" },
  isCorrect: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  studentName: { type: String, required: true, trim: true },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true
  },
  answers: { type: [answerSchema], default: [] },
  score: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  starsEarned: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
  completedDate: { type: String, required: true } // YYYY-MM-DD
});

module.exports = mongoose.model("Submission", submissionSchema);