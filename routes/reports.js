const express = require("express");
const Student = require("../models/Student");
const Submission = require("../models/Submission");
const Progress = require("../models/Progress");

const router = express.Router();

router.get("/overview", async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    const avgAgg = await Submission.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$score" },
          averageAccuracy: { $avg: "$accuracy" }
        }
      }
    ]);

    const subjectAgg = await Progress.aggregate([
      {
        $group: {
          _id: "$subject",
          averageAccuracy: { $avg: "$accuracy" },
          totalActivities: { $sum: 1 }
        }
      },
      { $sort: { averageAccuracy: -1 } }
    ]);

    res.json({
      ok: true,
      overview: {
        totalStudents,
        totalSubmissions,
        averageScore: avgAgg[0] ? Math.round(avgAgg[0].averageScore) : 0,
        averageAccuracy: avgAgg[0] ? Math.round(avgAgg[0].averageAccuracy) : 0,
        subjects: subjectAgg
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/student/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ ok: false, error: "Aluno não encontrado." });
    }

    const progress = await Progress.find({ studentId: student._id }).sort({ date: -1 });

    res.json({
      ok: true,
      student,
      progress
    });
  } catch (error) {
    next(error);
  }
});

router.get("/subject/:subject", async (req, res, next) => {
  try {
    const subject = req.params.subject;

    const progress = await Progress.find({ subject }).sort({ date: -1 });

    res.json({
      ok: true,
      subject,
      progress
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;