const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

router.get("/today", async (req, res, next) => {
  try {
    const date = String(req.query.date || "").trim();

    if (!date) {
      return res.status(400).json({ ok: false, error: "Informe a data em ?date=YYYY-MM-DD" });
    }

    const activity = await Activity.findOne({
      date,
      isActive: true
    }).sort({ createdAt: -1 });

    if (!activity) {
      return res.status(404).json({ ok: false, error: "Nenhuma atividade ativa para esta data." });
    }

    res.json({ ok: true, activity });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ date: -1, createdAt: -1 });
    res.json({ ok: true, activities });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ ok: false, error: "Atividade não encontrada." });
    }

    res.json({ ok: true, activity });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {
      title,
      subject,
      color,
      date,
      description = "",
      isActive = true,
      questions = []
    } = req.body;

    if (!title || !subject || !color || !date) {
      return res.status(400).json({
        ok: false,
        error: "title, subject, color e date são obrigatórios."
      });
    }

    const activity = await Activity.create({
      title,
      subject,
      color,
      date,
      description,
      isActive,
      questions
    });

    res.status(201).json({ ok: true, activity });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const update = { ...req.body };

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({ ok: false, error: "Atividade não encontrada." });
    }

    res.json({ ok: true, activity });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({ ok: false, error: "Atividade não encontrada." });
    }

    res.json({ ok: true, deleted: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;