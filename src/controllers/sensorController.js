const SensorData = require("../models/SensorData");
const PostgresSensorData = require("../models/PostgresSensorData");
const mqttClient = require("../config/mqttconnection");
const msgpack = require("msgpack5")();

exports.getJsonData = async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMsgpackData = async (req, res) => {
  try {
    const data = await PostgresSensorData.getLatest();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to handle incoming MQTT messages
const handleMqttMessage = async (topic, message) => {
  try {
    if (topic.endsWith("/data")) {
      const data = JSON.parse(message.toString());
      const sensorData = new SensorData(data);
      await sensorData.save();
      //   console.log("JSON data saved to MongoDB:", sensorData);
      console.log("JSON data saved to MongoDB:");
    } else if (topic.endsWith("/msgpack")) {
      const data = msgpack.decode(message);
      //   console.log("Decoded MessagePack data:", data);
      console.log("Decoded MessagePack data:");
      try {
        const result = await PostgresSensorData.insert(data);
        // console.log("MessagePack data saved to PostgreSQL:", result);
        console.log("MessagePack data saved to PostgreSQL:");
      } catch (pgError) {
        console.error("Error saving to PostgreSQL:", pgError);
      }
    }
  } catch (error) {
    console.error("Error handling MQTT message:", error);
  }
};

// Subscribe to MQTT messages
mqttClient.on("message", handleMqttMessage);
