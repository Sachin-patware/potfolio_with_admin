import type { NextFunction, Request, Response } from "express";
import { env } from "../lib/env.js";
import { verifyToken } from "../utils/jwt.js";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    request.user = verifyToken(token, env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
}
