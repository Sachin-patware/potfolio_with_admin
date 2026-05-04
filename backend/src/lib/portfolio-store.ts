import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const defaultStorePath = path.resolve(process.cwd(), "data", "portfolio.json");

function getStorePath() {
  return defaultStorePath;
}

export async function loadPortfolioData() {
  const storePath = getStorePath();

  try {
    const raw = await readFile(storePath, "utf8");
    const trimmed = raw.trim();
    if (!trimmed) {
      return {};
    }

    try {
      return JSON.parse(trimmed);
    } catch {
      return {};
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

export async function savePortfolioData(value: unknown) {
  const storePath = getStorePath();
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(value ?? {}, null, 2)}\n`, "utf8");
  return value ?? {};
}
