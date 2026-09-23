import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// --- Global middleware ---
app.use(helmet()); // sets secure HTTP headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // parse JSON request bodies
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
// Task routes get mounted here in part 3.

// --- Error handling (must come last) ---
app.use(notFound);
app.use(errorHandler);

export default app;