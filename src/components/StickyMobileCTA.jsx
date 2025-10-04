"use client";
import { TEXTS } from "@/lib/i18n/texts";
import { EVENT } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyMobileCTA({ lang, hidden = false }) {
  const t = TEXTS[lang];
  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed bottom-0 inset-x-0 z-50"
          aria-hidden
        >
          <div className="pointer-events-auto mx-auto mb-3 w-full max-w-md px-4 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center gap-2 rounded-2xl bg-white/95 p-2  ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/80">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.venue + ", " + EVENT.address)}`}
                target="_blank" rel="noreferrer"
                className="flex-1 rounded-xl bg-gray-900 px-3 py-2 text-center text-white font-medium active:scale-[.99]"
                title={t.sticky_directions}
              >
                {t.sticky_directions}
              </a>
              <a
                href={`tel:${EVENT.hotline}`}
                className="flex-1 rounded-xl px-3 py-2 text-center font-medium text-gray-900 ring-1 ring-gray-200 active:scale-[.99]"
                title={t.sticky_call(EVENT.hotline)}
              >
                {t.sticky_call(EVENT.hotline)}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
