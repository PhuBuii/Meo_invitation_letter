"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { COLORS, EVENT } from "@/lib/constants";
import { TEXTS } from "@/lib/i18n/texts";
import SectionTitle from "./SectionTitle";
import { fadeUp } from "@/lib/utils/motion";
import { getCountdown, two } from "@/lib/utils/date";
import { monthMatrix } from "@/lib/utils/matrix";

/* ---------- Compact Countdown box ---------- */
const CountdownBox = React.memo(function CountdownBox({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <div
        suppressHydrationWarning
        className="rounded-2xl px-3 py-2 text-xl md:px-4 md:py-3 md:text-3xl font-semibold shadow min-w-[72px] md:min-w-[84px] text-center"
        style={{ background: COLORS.white, color: COLORS.navy }}
      >
        {two(value)}
      </div>
      <span className="mt-2 text-[11px] md:text-xs tracking-wide text-white">{label}</span>
    </div>
  );
});

function MiniCalendar({ eventDate, lang, fredokaClass = "" }) {
  const y = eventDate.getFullYear();
  const m = eventDate.getMonth();
  const cells = useMemo(() => monthMatrix(y, m), [y, m]);
  const monthName = eventDate.toLocaleString(lang === "vi" ? "vi-VN" : "en-US", { month: "long" });
  const wk = lang === "vi" ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <motion.div {...fadeUp(0.05)} className="rounded-2xl p-4 shadow bg-white">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-pink-400 text-xs uppercase tracking-widest">{y}</p>
          <h4 className={`${fredokaClass} text-xl font-semibold text-[#0C2340]`}>{monthName}</h4>
        </div>
        <div className="rounded-md bg-[#A8D1FF] px-2 py-1 text-xs font-medium text-[#0C2340]">
          {two(eventDate.getDate())}/{two(m + 1)}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {wk.map((d) => (<div key={d} className="py-1 text-gray-600">{d}</div>))}
        {cells.map((c, idx) => {
          const isEvent = c.inMonth && c.d === eventDate.getDate();
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`relative rounded-md py-2 text-sm ${c.inMonth ? "text-gray-900" : "text-gray-300"}`}
              style={isEvent ? { background: "#A8D1FF", color: "#0C2340", fontWeight: 700 } : {}}
              aria-current={isEvent ? "date" : undefined}
            >
              {c.d}
              {isEvent && (
                <span
                  className="absolute inset-0 rounded-md ring-2"
                  style={{ borderColor: "#FF7DAE", boxShadow: "0 0 0 2px #FF7DAE inset" }}
                  aria-hidden
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function TimeSection({ lang, fredokaClass = "" }) {
  const t = TEXTS[lang];
  const [now, setNow] = useState(getCountdown(EVENT.start));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(getCountdown(EVENT.start)), 1000);
    return () => clearInterval(id);
  }, []);

  const safe = mounted ? now : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    // isolate tạo stacking context riêng → z-index làm việc như mong đợi
    <section id='time' className="relative isolate overflow-hidden" style={{ background: COLORS.navy }}>
      {/* BG layer 1: dots + line glow (z-0) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 2px),
            radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 2px),
            linear-gradient(120deg, #ffffff15 0%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
        aria-hidden
      />
      {/* BG layer 2: soft radial accents (z-0) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(60% 60% at 10% 20%, #A8D1FF22 0%, transparent 60%),
            radial-gradient(50% 50% at 90% 80%, #FF7DAE22 0%, transparent 60%)
          `,
        }}
        aria-hidden
      />

      {/* Content wrapper (z-10) */}
      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
        <motion.div {...fadeUp(0.05)} className="text-white flex flex-col items-center gap-3 text-center md:text-left">
          <SectionTitle title={t.time_title} subtitle={t.time_subtitle} special fredokaClass={fredokaClass} />
          <div className="grid grid-cols-2 gap-3 xs:grid-cols-4 md:gap-4 justify-items-center">
            <CountdownBox label={t.label_days} value={safe.days} />
            <CountdownBox label={t.label_hours} value={safe.hours} />
            <CountdownBox label={t.label_minutes} value={safe.minutes} />
            <CountdownBox label={t.label_seconds} value={safe.seconds} />
          </div>
          <a
            href={`tel:${EVENT.hotline}`}
            className="mt-5 w-auto rounded-xl px-5 py-2 font-medium shadow active:scale-[.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-center"
            style={{ background: COLORS.softPink, color: COLORS.white }}
            aria-label={t.btn_call(EVENT.hotline)}
            title={t.btn_call(EVENT.hotline)}
          >
            {t.btn_call(EVENT.hotline)}
          </a>
        </motion.div>

        <MiniCalendar eventDate={EVENT.start} lang={lang} fredokaClass={fredokaClass} />
      </div>
    </section>
  );
}
