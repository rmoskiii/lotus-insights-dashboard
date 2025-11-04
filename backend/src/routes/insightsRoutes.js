import express from "express";
import fs from "fs-extra";
import path from "path";
import { connect, getDb } from "../db.js";

const router = express.Router();
const dataPath = path.resolve("backend/sandbox-data");

router.get("/summary", async (req, res) => {
  // try DB
  try {
    await connect();
    const db = getDb();
    const usersCol = db.collection("users");
    const txCol = db.collection("transactions");
    const eventsCol = db.collection("feature_logs");
    const sessionsCol = db.collection("sessions");
    const onbCol = db.collection("onboarding");

    const [
      totalUsers,
      totalTransactions,
      revenueAgg,
      totalEvents,
      recentSessions,
      onboardingCompleted,
    ] = await Promise.all([
      usersCol.countDocuments(),
      txCol.countDocuments(),
      txCol
        .aggregate([
          { $match: { status: "success" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
        .toArray(),
      eventsCol.countDocuments(),
      sessionsCol.countDocuments({
        startedAt: {
          $gte: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        },
      }),
      onbCol.countDocuments({ completed: true }),
    ]);

    const totalRevenue = revenueAgg[0] && revenueAgg[0].total ? revenueAgg[0].total : 0;

    return res.json({
      totalUsers,
      totalTransactions,
      totalRevenue,
      activeSessionsLast7d: recentSessions,
      totalEvents,
      onboardingCompleted,
    });
  } catch (dbErr) {
    // fallback to file-based computation
    try {
      const users = await fs.readJson(`${dataPath}/users.json`);
      const transactions = await fs.readJson(`${dataPath}/transactions.json`);
      const sessions = await fs.readJson(`${dataPath}/sessions.json`);
      const events = await fs.readJson(`${dataPath}/events.json`);
      const onboarding = await fs.readJson(`${dataPath}/onboarding.json`);

      const totalUsers = users.length;
      const totalTransactions = transactions.length;
      const totalRevenue = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
      const activeSessions = sessions.filter((s) => s.active).length || sessions.length;
      const totalEvents = events.length;
      const onboardingCompleted = onboarding.filter((o) => o.completed).length;

      return res.json({
        totalUsers,
        totalTransactions,
        totalRevenue,
        activeSessionsLast7d: activeSessions,
        totalEvents,
        onboardingCompleted,
      });
    } catch (fileErr) {
      return res.status(500).json({ message: "Error computing summary", error: fileErr.message });
    }
  }
});

export default router;
