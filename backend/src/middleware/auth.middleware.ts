import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    const secret = process.env.JWT_SECRET ?? "replace-me";
    request.user = verifyToken(token, secret);
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
}
