"use client";
import { motion } from "framer-motion";
import { TEXTS } from "@/lib/i18n/texts";
import { COLORS } from "@/lib/constants";
import { fadeUp } from "@/lib/utils/motion";

export default function FooterThanks({ lang, fredokaClass = "" }) {
  const t = TEXTS[lang];
  return (
    <footer
      className="text-center px-4 py-12 [text-wrap:balance] pb-20 md:pb-10 "
      style={{ background: COLORS.navy }}
    >
      <motion.p  className={`${fredokaClass} text-2xl md:text-3xl font-semibold text-white`}>
        {t.footer_line1}
      </motion.p>
      <motion.p  className="mt-2 text-white/80 text-sm max-w-xl mx-auto">
        {t.footer_line2}
      </motion.p>
    </footer>
  );
}
