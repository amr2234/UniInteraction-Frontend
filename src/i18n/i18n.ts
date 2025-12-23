import { Language, TranslationKeys } from "./types";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

// Force reload of translations
const translations: Record<Language, TranslationKeys> = {
  en: en as TranslationKeys,
  ar: ar as TranslationKeys,
};

export class I18n {
  private currentLanguage: Language;
  private listeners: Set<(lang: Language) => void> = new Set();

  constructor() {
    const savedLang = localStorage.getItem("language") as Language;
    this.currentLanguage = savedLang && (savedLang === "en" || savedLang === "ar") ? savedLang : "ar";
    this.applyLanguageToDOM();
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(lang: Language): void {
    if (lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      localStorage.setItem("language", lang);
      this.applyLanguageToDOM();
      this.notifyListeners();
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === "en" ? "ar" : "en";
    this.setLanguage(newLang);
  }

  t(key: string): string {
    const keys = key.split(".");
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  interpolate(key: string, params: Record<string, string | number>): string {
    let text = this.t(key);
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`\\{${param}\\}`, "g"), String(value));
    });
    return text;
  }

  isRTL(): boolean {
    return this.currentLanguage === "ar";
  }

  getDirection(): "ltr" | "rtl" {
    return this.isRTL() ? "rtl" : "ltr";
  }

  private applyLanguageToDOM(): void {
    const html = document.documentElement;
    const direction = this.getDirection();
    
    html.lang = this.currentLanguage;
    html.dir = direction;
    
    if (this.isRTL()) {
      html.classList.add("rtl");
    } else {
      html.classList.remove("rtl");
    }
  }

  subscribe(listener: (lang: Language) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentLanguage));
  }
}

export const i18n = new I18n();
