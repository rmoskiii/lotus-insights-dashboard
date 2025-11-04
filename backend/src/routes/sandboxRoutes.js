import express from "express";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { connect, getDb } from "../db.js";

const router = express.Router();
const dataDir = path.resolve("backend/sandbox-data");

// GET /api/sandbox/:resource - serve from MongoDB when available, otherwise from file
router.get("/:resource", async (req, res) => {
  const { resource } = req.params;
  const limit = Math.min(1000, Number(req.query.limit) || 100);
  const skip = Number(req.query.skip) || 0;
  const filter = {};
  // simple common filters
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.feature) filter.feature = req.query.feature;
  if (req.query.segment) filter.segment = req.query.segment;

  // try DB
  try {
    await connect();
    const db = getDb();
    const colName = resource === "featureLogs" ? "feature_logs" : resource;
    const col = db.collection(colName);

    const [results, total] = await Promise.all([
      col.find(filter).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return res.json({ total, limit, skip, results });
  } catch (dbErr) {
    // fallback to file-based response
    const fileName = `${resource === "featureLogs" ? "featureLogs" : resource}.json`;
    const filePath = path.join(dataDir, fileName);
    try {
      const all = await fs.readJson(filePath);
      // apply simple filters in-memory
      let list = all;
      if (req.query.userId) list = list.filter((r) => r.userId === req.query.userId);
      if (req.query.feature) list = list.filter((r) => r.feature === req.query.feature);
      const total = list.length;
      const results = list.slice(skip, skip + limit);
      return res.json({ total, limit, skip, results });
    } catch (fileErr) {
      return res.status(404).json({ error: "Resource not found" });
    }
  }
});

// Regenerate sandbox data via script
router.post("/refresh", (req, res) => {
  const { users = 500, start = "2025-01-01", end = "2025-10-31", seed = 123 } = req.body;

  const command = `node src/generate-sandbox.js --users=${users} --start=${start} --end=${end} --seed=${seed}`;
  exec(command, (error) => {
    if (error) return res.status(500).json({ message: "Generation failed", error });
    res.json({ message: "Sandbox data regenerated successfully" });
  });
});

export default router;
