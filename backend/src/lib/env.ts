import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_SECRET: z.string().min(16),
  ADMIN_USERNAME: z.string().trim().email(),
  ADMIN_PASSWORD: z.string().min(6),
  ADMIN_NAME: z.string().trim().optional().default("Admin"),
  CLIENT_ORIGIN: z.string().trim().optional().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
