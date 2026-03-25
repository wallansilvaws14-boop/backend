require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const activitiesRoutes = require("./routes/activities");
const studentsRoutes = require("./routes/students");
const submissionsRoutes = require("./routes/submissions");
const reportsRoutes = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 3210;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "API Avaliações Infantil",
    version: "1.0.0"
  });
});

app.use("/api/activities", activitiesRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/reports", reportsRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Rota não encontrada." });
});

app.use((err, req, res, next) => {
  console.error("Erro interno:", err);
  res.status(500).json({
    ok: false,
    error: err.message || "Erro interno do servidor."
  });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API em http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar:", error.message);
    process.exit(1);
  }
}

start();