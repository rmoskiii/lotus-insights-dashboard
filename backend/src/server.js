import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sandboxRoutes from "./routes/sandboxRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sandbox", sandboxRoutes);
app.use("/api/insights", insightsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
