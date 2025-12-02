import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { i18n } from "./i18n";
import { Language } from "./types";

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  interpolate: (key: string, params: Record<string, string | number>) => string;
  isRTL: boolean;
  direction: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((newLang) => {
      setLanguageState(newLang);
    });

    return unsubscribe;
  }, []);

  const setLanguage = (lang: Language) => {
    i18n.setLanguage(lang);
  };

  const toggleLanguage = () => {
    i18n.toggleLanguage();
  };

  const t = (key: string): string => {
    return i18n.t(key);
  };

  const interpolate = (key: string, params: Record<string, string | number>): string => {
    return i18n.interpolate(key, params);
  };

  const value: I18nContextValue = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    interpolate,
    isRTL: i18n.isRTL(),
    direction: i18n.getDirection(),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
