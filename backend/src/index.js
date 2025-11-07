// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const deptRouter = require('./routes/departments');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3002' }));
app.use(express.json());

app.use('/api/departments', deptRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

(async () => {
  try {
    await db.query('SELECT 1');
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  } catch (err) {
    console.error('DB connection error', err);
    process.exit(1);
  }
})();


app.get("/", (req, res) => {
  res.send("✅ Department Backend is running and connected to PostgreSQL!");
});
