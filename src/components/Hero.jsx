"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { COLORS, EVENT } from "@/lib/constants";
import { TEXTS } from "@/lib/i18n/texts";
import { fadeIn, fadeUp } from "@/lib/utils/motion";
import ToggleLangButton from "./ToggleLangButton";
import StickyMobileCTA from "./StickyMobileCTA";

/* Icons (SVG thuần) */
const ClockIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    {...props}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const MapPinIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    {...props}
  >
    <path
      d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="10" r="2.8" fill="currentColor" />
  </svg>
);
const PhoneIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    {...props}
  >
    <path
      d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.4 19.4 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.7.6 2.5a2 2 0 01-.5 2L8 9.3a16 16 0 006 6l1.1-1.1a2 2 0 012-.5c.8.2 1.6.5 2.5.6A2 2 0 0122 16.9z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

export default function Hero({
  lang,
  onToggleLang,
  interClass = "",
  fredokaClass = "",
}) {
  const t = TEXTS[lang];
  const prefersReducedMotion = useReducedMotion();

  // gợi ý: thêm `html { scroll-behavior: smooth; }` vào globals.css để mượt với anchor
  const scrollToId = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const timeFormatted = new Intl.DateTimeFormat(
    lang === "vi" ? "vi-VN" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: lang === "vi" ? "2-digit" : "short",
      hour12: false,
    }
  )
    .format(EVENT.start)
    .replace(",", " –");

  const heroText = t.hero_para
    .replace("{name}", t.hero_name)
    .replace("{time}", timeFormatted)
    .replace("{venue}", EVENT.venue);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: COLORS.navy }}
    >
      {/* Parallax bubbles */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full"
            style={{
              background: COLORS.pastelBlue,
              opacity: 0.35,
              willChange: "transform",
            }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -left-16 bottom-0 h-40 w-40 rounded-full"
            style={{
              background: COLORS.softPink,
              opacity: 0.35,
              willChange: "transform",
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Toggle ngôn ngữ */}
      <ToggleLangButton lang={lang} onToggle={onToggleLang} />

      {/* CONTENT */}
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
        {/* Left: Copy + Chips */}
        <motion.div
          {...fadeUp(0.05)}
          className="w-full flex flex-col items-center md:items-start"
        >
          <p className="mb-2 uppercase tracking-widest font-bold text-white text-outline-blue  ">
            {t.invitation_overline}
          </p>

          <h1
            className={`${fredokaClass} text-4xl md:text-5xl font-semibold `}
            style={{ color: COLORS.pastelBlue }}
          >
            {t.hero_name}
          </h1>

          {/* mô tả — crossfade theo language */}
          <AnimatePresence mode="wait">
            <motion.p
              key={lang}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{ color: COLORS.pastelBlue }}
              className={`${interClass} mt-3 text-[15px] max-w-sm leading-relaxed `}
            >
              {heroText}
            </motion.p>
          </AnimatePresence>

          {/* Chips: làm nổi bật thời gian (primary) + địa điểm (secondary) */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* TIME — button để scroll tới #time */}
            <button
              type="button"
              onClick={scrollToId("time")}
              className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold shadow ring-1 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                background: COLORS.pastelBlue,
                color: COLORS.navy,
                borderColor: "transparent",
              }}
              aria-label={t.chip_time(EVENT.start)}
              title={t.chip_time(EVENT.start)}
            >
              <ClockIcon />
              <span className="ml-2">{t.chip_time(EVENT.start)}</span>
            </button>

            {/* PLACE — anchor tới #map (Next.js Link + hash) */}
            <Link
              href="#map"
              onClick={scrollToId("map")}
              className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-800 shadow ring-1 ring-black/5 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label={t.chip_place}
              title={t.chip_place}
            >
              <MapPinIcon />
              <span className="ml-2">{t.chip_place}</span>
            </Link>
          </div>
        </motion.div>

        {/* Right: Hero image */}
        <motion.div
          {...fadeIn(0.1)}
          className="relative will-change-transform"
          whileHover={
            !prefersReducedMotion ? { rotate: -0.5, scale: 1.01 } : undefined
          }
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <div
            className="mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,0)) padding-box, linear-gradient(135deg, rgba(255,125,174,.6), rgba(168,209,255,.6)) border-box",
              border: "2px solid transparent",
            }}
          >
            <Image
              src="/hero.png"
              alt="Ảnh chân dung Vân Khánh trong ngày tốt nghiệp"
              width={900}
              height={1200}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* CTA dính dưới cùng trên mobile */}
      <StickyMobileCTA lang={lang} />
    </section>
  );
}
