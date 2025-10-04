"use client";
import { Inter, Fredoka } from "next/font/google";
import React from "react";
import Hero from "@/components/Hero";
import MemoriesGrid from "@/components/MemoriesGrid";
import TimeSection from "@/components/TimeSection";
import InfoAndMaps from "@/components/InfoAndMaps";
import FooterThanks from "@/components/FooterThanks";
import useLang from "@/hooks/useLang";
import { TEXTS } from "@/lib/i18n/texts";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700"] });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400","500","600","700"] });

export default function Page() {
  const { lang, toggle } = useLang();
  const skipId = "main-content";

  return (
    <main className={`${inter.className} relative min-h-screen`}>
      <a href={`#${skipId}`} className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:left-4 focus:top-4 bg-white text-gray-900 px-3 py-2 rounded shadow">
        {TEXTS[lang].skip_to_content}
      </a>

      <Hero lang={lang} onToggleLang={toggle} interClass={inter.className} fredokaClass={fredoka.className}/>
      <div id={skipId} />
      <MemoriesGrid lang={lang} fredokaClass={fredoka.className}/>
      <TimeSection lang={lang} fredokaClass={fredoka.className} interClass={inter.className}/>
      <InfoAndMaps lang={lang} fredokaClass={fredoka.className}/>
      <FooterThanks lang={lang} fredokaClass={fredoka.className}/>
    </main>
  );
}
