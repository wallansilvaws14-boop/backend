const express = require("express");
const Submission = require("../models/Submission");
const Student = require("../models/Student");
const Activity = require("../models/Activity");
const Progress = require("../models/Progress");
const { calculateResult } = require("../utils/scoring");
const { updateStreak } = require("../utils/streak");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const {
      studentName,
      studentCode = "",
      activityId,
      answers = {},
      completedDate
    } = req.body;

    if (!studentName || !activityId || !completedDate) {
      return res.status(400).json({
        ok: false,
        error: "studentName, activityId e completedDate são obrigatórios."
      });
    }

    let student = null;

    if (studentCode) {
      student = await Student.findOne({ code: studentCode });
    }

    if (!student) {
      student = await Student.findOne({ name: studentName.trim() });
    }

    if (!student) {
      student = await Student.create({
        name: studentName.trim(),
        code: studentCode.trim()
      });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ ok: false, error: "Atividade não encontrada." });
    }

    const existingSubmission = await Submission.findOne({
      studentId: student._id,
      activityId: activity._id
    });

    if (existingSubmission) {
      return res.status(400).json({
        ok: false,
        error: "Esta atividade já foi enviada por este aluno."
      });
    }

    const result = calculateResult(activity, answers);

    const submission = await Submission.create({
      studentId: student._id,
      studentName: student.name,
      activityId: activity._id,
      answers: result.answers,
      score: result.score,
      accuracy: result.accuracy,
      starsEarned: result.starsEarned,
      completedDate
    });

    const newStreak = updateStreak(student, completedDate);
    student.totalPoints += result.score;
    student.stars += result.starsEarned;
    await student.save();

    await Progress.create({
      studentId: student._id,
      subject: activity.subject,
      date: completedDate,
      score: result.score,
      accuracy: result.accuracy,
      streakAfterCompletion: newStreak
    });

    res.status(201).json({
      ok: true,
      submission,
      student: {
        _id: student._id,
        name: student.name,
        totalPoints: student.totalPoints,
        stars: student.stars,
        streakDays: student.streakDays
      },
      result: {
        score: result.score,
        accuracy: result.accuracy,
        starsEarned: result.starsEarned
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/activity/:activityId", async (req, res, next) => {
  try {
    const submissions = await Submission.find({ activityId: req.params.activityId })
      .sort({ completedAt: -1 });

    res.json({ ok: true, submissions });
  } catch (error) {
    next(error);
  }
});

router.get("/student/:studentId", async (req, res, next) => {
  try {
    const submissions = await Submission.find({ studentId: req.params.studentId })
      .sort({ completedAt: -1 })
      .populate("activityId", "title subject color date");

    res.json({ ok: true, submissions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;