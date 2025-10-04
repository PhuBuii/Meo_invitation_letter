"use client";
import { motion } from "framer-motion";

export default function SectionAccent({ from = "#A8D1FF22", to = "#FF7DAE22" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage: `
          radial-gradient(60% 60% at 20% 20%, ${from} 0%, transparent 60%),
          radial-gradient(50% 50% at 80% 60%, ${to} 0%, transparent 60%)
        `,
        willChange: "transform",
      }}
    />
  );
}
