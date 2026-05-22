import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { getAllowedOrigins } from "./config/cors.js";
import { apiRoutes } from "./routes/index.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import { notFound } from "./shared/middlewares/notFound.js";

const app = express();

const allowedOrigins = getAllowedOrigins();

// ─── Security & Parsing ────────────────────────────────────────────────────
app.use(
  cors({
    origin(origin, callback) {
      // Postman, health checks — sem header Origin
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      if (env.NODE_ENV === "development") {
        console.warn(`[CORS] Origem bloqueada: ${origin}. Permitidas:`, allowedOrigins);
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

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
