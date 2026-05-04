import { defaultPortfolio } from "@/lib/default-portfolio";
import type { PortfolioData } from "@/types/portfolio";

const STORAGE_KEY = "sachin-portfolio-data";
const ADMIN_KEY = "sachin-portfolio-admin";
const ADMIN_TOKEN_KEY = "sachin-portfolio-admin-token";
const NAV_ORDER = ["Home", "About", "Education", "Experience", "Projects", "Skills", "Contact", "Resume"];

function isBrowser() {
  return typeof window !== "undefined";
}

export function getPortfolioSnapshot(): PortfolioData {
  if (!isBrowser()) {
    return normalizePortfolioData(defaultPortfolio);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return normalizePortfolioData(defaultPortfolio);
  }

  try {
    return normalizePortfolioData(JSON.parse(stored));
  } catch {
    return normalizePortfolioData(defaultPortfolio);
  }
}

export async function loadPortfolio(): Promise<PortfolioData> {
  const apiBase = import.meta.env.VITE_PORTFOLIO_API_BASE_URL as string | undefined;

  if (apiBase) {
    try {
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/portfolio`);
      if (response.ok) {
        const data = (await response.json()) as unknown;
        const normalized = normalizePortfolioData(data);
        if (isBrowser()) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
        return normalized;
      }
    } catch {
      // fall back to local storage below
    }
  }

  return getPortfolioSnapshot();
}

export async function savePortfolio(portfolio: PortfolioData): Promise<PortfolioData> {
  const apiBase = import.meta.env.VITE_PORTFOLIO_API_BASE_URL as string | undefined;
  const adminToken = getAdminToken();

  if (isBrowser()) {
    const normalized = normalizePortfolioData(portfolio);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent("portfolio-updated", { detail: normalized }));
  }

  if (apiBase) {
    try {
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/portfolio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify(portfolio),
      });

      if (response.ok) {
        const updated = (await response.json()) as PortfolioData;
        const normalized = normalizePortfolioData(updated);
        if (isBrowser()) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          window.dispatchEvent(new CustomEvent("portfolio-updated", { detail: normalized }));
        }
        return normalized;
      }
    } catch {
      // fall through to the locally stored copy
    }
  }

  return portfolio;
}

function normalizePortfolioData(value: unknown): PortfolioData {
  const merged = mergeDeep(defaultPortfolio, isObject(value) ? value : {}) as PortfolioData;
  merged.resume = {
    ...defaultPortfolio.resume,
    ...(isObject(merged.resume) ? merged.resume : {}),
  };
  merged.navItems = reorderNavItems(merged.navItems);
  return merged;
}

function reorderNavItems(navItems: PortfolioData["navItems"]) {
  const byLabel = new Map<string, PortfolioData["navItems"][number]>();
  for (const item of defaultPortfolio.navItems) {
    byLabel.set(item.label, item);
  }
  for (const item of navItems) {
    byLabel.set(item.label, item);
  }
  const ordered = NAV_ORDER.map((label) => byLabel.get(label)).filter(
    (item): item is PortfolioData["navItems"][number] => Boolean(item),
  );
  const remaining = navItems.filter((item) => !NAV_ORDER.includes(item.label));
  return [...ordered, ...remaining];
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (!isObject(base) || !isObject(override)) {
    return (override ?? base) as T;
  }

  const result: Record<string, unknown> = { ...base };
  for (const [key, baseValue] of Object.entries(base)) {
    const overrideValue = override[key];
    result[key] = mergeDeep(baseValue, overrideValue);
  }
  return result as T;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isPortfolioData(value: unknown): value is PortfolioData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;
  return (
    typeof data.siteName === "string" &&
    typeof data.seo === "object" &&
    data.seo !== null &&
    typeof (data.seo as Record<string, unknown>).title === "string" &&
    typeof data.hero === "object" &&
    data.hero !== null &&
    typeof (data.hero as Record<string, unknown>).name === "string" &&
    typeof data.about === "object" &&
    data.about !== null &&
    typeof data.skills === "object" &&
    data.skills !== null &&
    typeof data.projects === "object" &&
    data.projects !== null &&
    typeof data.experience === "object" &&
    data.experience !== null &&
    typeof data.education === "object" &&
    data.education !== null &&
    typeof data.contact === "object" &&
    data.contact !== null &&
    Array.isArray(data.navItems) &&
    Array.isArray(data.socialLinks)
  );
}

export function getAdminSession() {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(ADMIN_KEY) === "authenticated";
}

export function setAdminSession(authenticated: boolean) {
  if (!isBrowser()) {
    return;
  }

  if (authenticated) {
    window.localStorage.setItem(ADMIN_KEY, "authenticated");
  } else {
    window.localStorage.removeItem(ADMIN_KEY);
  }
}

export function getAdminToken() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (!isBrowser()) {
    return;
  }

  if (token) {
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}
