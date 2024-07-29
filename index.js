require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/mongoDB");
const sensorRoutes = require("./src/routes/sensorRoutes");
const pool = require("./src/config/postgresDB");

const app = express();

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("PostgreSQL connected:", res.rows[0].now);
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/sensor", sensorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
