import type { Request, Response } from "express";
import {
  loadPortfolioData,
  savePortfolioData,
} from "../lib/portfolio-store.js";

export async function getPortfolio(_request: Request, response: Response) {
  const document = await loadPortfolioData();
  return response.json(document);
}

export async function updatePortfolio(request: Request, response: Response) {
  if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) {
    return response.status(400).json({ message: "Portfolio payload must be an object" });
  }

  const updated = await savePortfolioData(request.body);
  return response.json(updated);
}
