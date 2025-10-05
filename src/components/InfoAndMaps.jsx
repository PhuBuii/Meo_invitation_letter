"use client";
import { motion } from "framer-motion";
import { TEXTS } from "@/lib/i18n/texts";
import { COLORS, EVENT } from "@/lib/constants";
import SectionAccent from "./SectionAccent";
import SectionTitle from "./SectionTitle";
import { fadeUp } from "@/lib/utils/motion";

export default function InfoAndMaps({ lang, fredokaClass = "" }) {
  const t = TEXTS[lang];

  const timeLine =
    lang === "vi"
      ? "17:15 – 19:00, 14/10"
      : `${new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(EVENT.start)} – ${new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(EVENT.end)}, Oct 14`;

  return (
    <section
      id="map"
      className="relative container mx-auto px-4 py-12 md:py-16 max-w-6xl"
    >
      <SectionAccent from="#A8D1FF18" to="#FF7DAE18" />
      <SectionTitle
        overline={t.map_overline}
        image={"/map.png"}
        title={t.map_title}
        subtitle={t.map_subtitle}
        fredokaClass={fredokaClass}
      />

      <div className="grid md:grid-cols-5 gap-6 items-start">
        <motion.div
          {...fadeUp(0.05)}
          className="md:col-span-2 rounded-2xl p-5 "
        >
          <h4
            className={`${fredokaClass} text-xl font-semibold`}
            style={{ color: COLORS.pastelBlue }}
          >
            {EVENT.venue}
          </h4>
          <p className="mt-1 text-sm text-gray-700">{EVENT.address}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <span className="font-medium">{t.info_time}:</span> {timeLine}
            </li>
            <li>
              <span className="font-medium">{t.info_dresscode}:</span>{" "}
              {t.dresscode_value}
            </li>
            <li>
              <span className="font-medium">{t.info_contact}:</span>{" "}
              {EVENT.hotline}
            </li>
          </ul>
          <div
            className="mt-4 inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{ background: COLORS.pastelBlue, color: COLORS.navy }}
          >
            {t.info_badge}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="md:col-span-3 overflow-hidden rounded-2xl shadow ring-1 ring-gray-100"
          style={{ willChange: "transform" }}
        >
          <iframe
            title="Google Maps"
            src={EVENT.mapsEmbed}
            className="h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
