const express = require("express");
const Student = require("../models/Student");
const Submission = require("../models/Submission");

const router = express.Router();

router.post("/find-or-create", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const code = String(req.body.code || "").trim();

    if (!name) {
      return res.status(400).json({ ok: false, error: "Nome é obrigatório." });
    }

    let student = null;

    if (code) {
      student = await Student.findOne({ code });
    }

    if (!student) {
      student = await Student.findOne({ name });
    }

    if (!student) {
      student = await Student.create({
        name,
        code
      });
    }

    res.json({ ok: true, student });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ ok: false, error: "Aluno não encontrado." });
    }

    res.json({ ok: true, student });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/history", async (req, res, next) => {
  try {
    const submissions = await Submission.find({ studentId: req.params.id })
      .sort({ completedAt: -1 })
      .populate("activityId", "title subject color date");

    res.json({ ok: true, history: submissions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;