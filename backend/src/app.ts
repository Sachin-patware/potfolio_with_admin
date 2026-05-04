import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import { env } from "./lib/env.js";

const app = express();
const allowedOrigins = env.CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_request, response) => response.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

export default app;
