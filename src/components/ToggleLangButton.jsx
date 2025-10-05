"use client";
import { motion } from "framer-motion";
import { COLORS } from "@/lib/constants";

export default function ToggleLangButton({
  lang,
  onToggle,
  label = "Toggle language",
}) {
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={onToggle}
      onKeyDown={onKey}
      role="switch"
      aria-checked={lang === "en"}
      aria-label="Toggle language"
      title={label}
      className="absolute bottom-1 right-4 z-30 select-none rounded-2xl px-3 py-2 text-sm font-semibold shadow-lg ring-1 ring-black/5 md:bottom-4 md:right-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{
        background: "#FFFFFF", // thay vì bg-white/90
        color: COLORS.pastelBlue, // ép chữ xanh navy
        WebkitTextFillColor: COLORS.pastelBlue, // chống iOS override
        willChange: "transform",
      }}
    >
      {lang === "vi" ? "VI ↔ EN" : "EN ↔ VI"}
    </motion.button>
  );
}
