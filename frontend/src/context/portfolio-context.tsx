import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loadPortfolio, savePortfolio } from "@/lib/portfolio-storage";
import { defaultPortfolio } from "@/lib/default-portfolio";
import type { PortfolioData } from "@/types/portfolio";

type PortfolioContextValue = {
  portfolio: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
  refreshPortfolio: () => Promise<void>;
  updatePortfolio: (next: PortfolioData) => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolio);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      setIsLoading(true);
      const data = await loadPortfolio();
      if (mounted) {
        setPortfolio(data);
        setIsLoading(false);
      }
    };

    bootstrap();

    const handlePortfolioUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<PortfolioData>;
      if (customEvent.detail) {
        setPortfolio(customEvent.detail);
      }
    };

    window.addEventListener("portfolio-updated", handlePortfolioUpdated);

    return () => {
      mounted = false;
      window.removeEventListener("portfolio-updated", handlePortfolioUpdated);
    };
  }, []);

  const updatePortfolio = async (next: PortfolioData) => {
    setIsSaving(true);
    try {
      const saved = await savePortfolio(next);
      setPortfolio(saved);
    } finally {
      setIsSaving(false);
    }
  };

  const refreshPortfolio = async () => {
    setIsLoading(true);
    const data = await loadPortfolio();
    setPortfolio(data);
    setIsLoading(false);
  };

  const value = useMemo(
    () => ({ portfolio, isLoading, isSaving, refreshPortfolio, updatePortfolio }),
    [portfolio, isLoading, isSaving]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
