"use client";
import { useEffect, useState, useCallback } from "react";

export default function useLang() {
  const [lang, setLang] = useState("vi");

  // load from localStorage
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("invite_lang") : null;
    if (saved === "vi" || saved === "en") setLang(saved);
  }, []);

  // set <html lang="...">
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === "vi" ? "en" : "vi";
      if (typeof window !== "undefined") localStorage.setItem("invite_lang", next);
      return next;
    });
  }, []);

  return { lang, toggle };
}
