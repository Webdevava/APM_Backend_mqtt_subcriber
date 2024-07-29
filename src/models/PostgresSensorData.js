// PostgresSensorData.js

const pool = require("../config/postgresDB");

const PostgresSensorData = {
  async init() {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS sensor_data (
          id SERIAL PRIMARY KEY,
          device_id VARCHAR(255) NOT NULL,
          timestamp BIGINT NOT NULL,
          pressure FLOAT,
          light_level FLOAT
        );
      `;
      await pool.query(createTableQuery);
      console.log("Table 'sensor_data' is ready or already exists.");
    } catch (error) {
      if (error.code === "42P07") {
        // Postgres error code for "duplicate table"
        console.log("Table 'sensor_data' already exists.");
      } else {
        console.error("Error creating table 'sensor_data':", error);
        throw error;
      }
    }
  },

  async getLatest() {
    try {
      const res = await pool.query(
        "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 10"
      );
      return res.rows;
    } catch (error) {
      console.error("Error fetching latest data from PostgreSQL:", error);
      throw error;
    }
  },

  async insert(data) {
    try {
      const query = `
        INSERT INTO sensor_data (device_id, timestamp, pressure, light_level) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`;
      const values = [
        data.device_id,
        data.timestamp,
        data.pressure,
        data.light_level,
      ];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error("Error inserting data into PostgreSQL:", error);
      throw error;
    }
  },
};

module.exports = PostgresSensorData;
