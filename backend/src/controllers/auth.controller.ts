import type { Request, Response } from "express";
import { env } from "../lib/env.js";
import { signToken } from "../utils/jwt.js";

export async function login(request: Request, response: Response) {
  const { email, username, password } = request.body as {
    email?: string;
    username?: string;
    password?: string;
  };

  const loginId = email ?? username;
  const configuredUsername = env.ADMIN_USERNAME;
  const configuredPassword = env.ADMIN_PASSWORD;
  const configuredName = env.ADMIN_NAME;

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
    env.JWT_SECRET,
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
