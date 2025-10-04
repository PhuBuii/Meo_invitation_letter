"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionAccent from "./SectionAccent";
import SectionTitle from "./SectionTitle";
import { TEXTS } from "@/lib/i18n/texts";
import { staggerContainer, staggerItem } from "@/lib/utils/motion";

export default function MemoriesGrid({ lang, fredokaClass = "" }) {
  const t = TEXTS[lang];

  return (
    <section className="relative container mx-auto px-4 py-12 md:py-16 max-w-6xl">
      <SectionAccent />
      <div className="flex gap-4">
        <SectionTitle
          overline={t.memories_overline}
          image={"/gallery.png"}
          title={t.memories_title}
          subtitle={t.memories_subtitle}
          fredokaClass={fredokaClass}
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        custom={0.05}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div variants={staggerItem} className="md:col-span-2 overflow-hidden rounded-2xl group">
          <Image
            src="/anh_1.jpg"
            alt="Khoảnh khắc đáng nhớ 1"
            width={1600}
            height={900}
            className="h-64 md:h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </motion.div>
        <motion.div variants={staggerItem} className="overflow-hidden rounded-2xl group">
          <Image
            src="/anh_2.jpg"
            alt="Khoảnh khắc đáng nhớ 2"
            width={800}
            height={800}
            loading="lazy"
            className="h-64 md:h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </motion.div>
        <motion.div variants={staggerItem} className="overflow-hidden rounded-2xl group">
          <Image
            src="/anh_3.jpg"
            alt="Khoảnh khắc đáng nhớ 3"
            width={800}
            height={800}
            loading="lazy"
            className="h-64 md:h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
