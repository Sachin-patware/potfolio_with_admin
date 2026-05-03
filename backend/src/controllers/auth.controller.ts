import type { Request, Response } from "express";
import { signToken } from "../utils/jwt.js";

export async function login(request: Request, response: Response) {
  const { email, username, password } = request.body as {
    email?: string;
    username?: string;
    password?: string;
  };

  const loginId = email ?? username;
  const configuredUsername = (
    process.env.ADMIN_USERNAME ?? process.env.ADMIN_EMAIL ?? ""
  ).trim();
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";
  const configuredName = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!loginId || !password) {
    return response.status(400).json({ message: "Email/username and password are required" });
  }

  if (!configuredUsername || !configuredPassword) {
    return response.status(500).json({
      message: "Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in .env",
    });
  }

  const normalizedLoginId = loginId.trim().toLowerCase();
  const normalizedConfiguredUsername = configuredUsername.toLowerCase();

  if (normalizedLoginId !== normalizedConfiguredUsername || password !== configuredPassword) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(
    {
      userId: "admin",
      email: configuredUsername,
      role: "admin",
    },
    process.env.JWT_SECRET ?? "replace-me",
    "1d",
  );

  return response.json({
    token,
    user: {
      id: "admin",
      name: configuredName,
      email: configuredUsername,
      role: "admin",
    },
  });
}
