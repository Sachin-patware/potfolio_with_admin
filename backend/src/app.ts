import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_request, response) => response.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

export default app;
