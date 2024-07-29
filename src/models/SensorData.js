const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
  device_id: String,
  timestamp: Number,
  temperature: Number,
  humidity: Number,
});

module.exports = mongoose.model("SensorData", SensorDataSchema);
