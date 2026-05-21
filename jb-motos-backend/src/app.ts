import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { apiRoutes } from "./routes/index.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import { notFound } from "./shared/middlewares/notFound.js";

const app = express();

// ─── Security & Parsing ────────────────────────────────────────────────────
app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "JB Motos API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────
app.use("/api/v1", apiRoutes);

// ─── 404 & Error Handler ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export { app };
