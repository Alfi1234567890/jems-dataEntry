// backend/src/routes/departments.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ GET all departments
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM departments ORDER BY departmentid");
    res.json(result.rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ GET one
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM departments WHERE departmentid = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ CREATE
router.post("/", async (req, res) => {
  const { departmentcode, departmentname, phonenumber, location, description, status } = req.body;
  try {
    const sql = `INSERT INTO departments
      (departmentcode, departmentname, phonenumber, location, description, status)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const values = [departmentcode, departmentname, phonenumber, location, description, status || "ACTIVE"];
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { departmentcode, departmentname, phonenumber, location, description, status } = req.body;
  try {
    const sql = `UPDATE departments SET
      departmentcode = $1, departmentname = $2, phonenumber = $3, location = $4,
      description = $5, status = $6, updatedat = NOW()
      WHERE departmentid = $7 RETURNING *`;
    const values = [departmentcode, departmentname, phonenumber, location, description, status || "ACTIVE", id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ DELETE (NO DATABASE DELETE)
router.delete("/:id", async (req, res) => {
  // ❌ Not deleting in database anymore
  res.json({ message: "Delete simulated — record not removed from DB" });
});

module.exports = router;
