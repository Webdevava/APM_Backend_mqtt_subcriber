const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

router.get("/json-data", sensorController.getJsonData);
router.get("/msgpack-data", sensorController.getMsgpackData);

module.exports = router;
