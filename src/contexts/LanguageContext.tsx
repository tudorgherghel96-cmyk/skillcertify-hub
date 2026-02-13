import React, { createContext, useContext, useState, useEffect } from "react";
import { getFontFamily } from "@/i18n/translations";

export interface Language {
  code: string;
  flag: string;
  english: string;
  native: string;
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "en", flag: "", english: "English", native: "English" },
  { code: "ro", flag: "", english: "Romanian", native: "Română" },
  { code: "pl", flag: "", english: "Polish", native: "Polski" },
  { code: "lt", flag: "", english: "Lithuanian", native: "Lietuvių" },
  { code: "bg", flag: "", english: "Bulgarian", native: "Български" },
  { code: "ar", flag: "", english: "Arabic", native: "العربية", rtl: true },
  { code: "ti", flag: "", english: "Tigrinya", native: "ትግርኛ" },
  { code: "yo", flag: "", english: "Yoruba", native: "Yorùbá" },
  { code: "ig", flag: "", english: "Igbo", native: "Igbo" },
  { code: "so", flag: "", english: "Somali", native: "Soomaali" },
  { code: "am", flag: "", english: "Amharic", native: "አማርኛ" },
];

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("sc_language");
    return LANGUAGES.find((l) => l.code === saved) || LANGUAGES[0];
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sc_language", lang.code);
  };

  useEffect(() => {
    document.documentElement.dir = language.rtl ? "rtl" : "ltr";
    document.body.style.fontFamily = getFontFamily(language.code);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
