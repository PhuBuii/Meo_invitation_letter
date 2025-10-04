"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { COLORS } from "@/lib/constants";

export default function SectionTitle({
  overline,
  image,
  title,
  subtitle,
  special = false,
  fredokaClass = "",
}) {
  return (
    <motion.div
      {...fadeUp(0.05)}
      className={`mx-auto mb-6 text-center max-w-2xl flex ${
        special ? "justify-center md:justify-start" : "justify-center"
      } items-center gap-2`}
    >
      {image && (
        <Image
          src={image}
          alt="Topic"
          width={60}
          height={90}
          className="object-cover"
        />
      )}
      <div className="flex items-center justify-center flex-col">
        {overline && (
          <p
            className="uppercase font-medium tracking-widest text-sm"
            style={{ color: COLORS.softPink }}
          >
            {overline}
          </p>
        )}
        <h2
          className={`${fredokaClass} text-3xl md:text-4xl font-semibold`}
          style={{ color: special ? COLORS.softPink : COLORS.navy }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className={`mt-2 text-[15px] ${
              special ? "text-white" : "text-gray-600"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
