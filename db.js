const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI não definida no .env");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB conectado.");
}

module.exports = connectDB;