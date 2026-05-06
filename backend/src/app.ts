import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

const app = express();
const allowedOrigins = [
  "http://localhost:8080",
  "https://sachinpatware.me",
  "https://www.sachinpatware.me",
  "https://sachin-patware.netlify.app",
]; 
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_request, response) => response.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

export default app;
