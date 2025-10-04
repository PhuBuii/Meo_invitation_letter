// app/page.jsx
"use client";
import { Inter, Fredoka } from "next/font/google";
import React from "react";
import dynamic from "next/dynamic";
import useLang from "@/hooks/useLang";
import { TEXTS } from "@/lib/i18n/texts";
import NetworkAwareLoader from "@/components/NetworkAwareLoader";

// Lazy load các section nặng
const Hero = dynamic(() => import("@/components/Hero"), { ssr: true });
const MemoriesGrid = dynamic(() => import("@/components/MemoriesGrid"), {
  ssr: true,
  loading: () => <div className="h-[300px] w-full animate-pulse bg-gray-200 rounded-2xl" />,
});
const TimeSection = dynamic(() => import("@/components/TimeSection"), { ssr: true });
const InfoAndMaps = dynamic(() => import("@/components/InfoAndMaps"), {
  ssr: true,
  loading: () => <div className="h-[360px] w-full animate-pulse bg-gray-200 rounded-2xl" />,
});
const FooterThanks = dynamic(() => import("@/components/FooterThanks"), { ssr: true });

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700"] });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400","500","600","700"] });

export default function Page() {
  const { lang, toggle } = useLang();
  const skipId = "main-content";

  // Ví dụ: nếu bạn có state isPending thì truyền vào active
  const isPending = true; // <-- thay bằng logic thật (transition, fetch…)

  return (
    <main className={`${inter.className} relative min-h-screen`}>
      <a
        href={`#${skipId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:left-4 focus:top-4 bg-white text-gray-900 px-3 py-2 rounded shadow"
      >
        {TEXTS[lang].skip_to_content}
      </a>

      {/* Bật overlay khi mạng yếu hoặc pending quá threshold */}
      <NetworkAwareLoader
        active={isPending}
        thresholdMs={650}
        forceAfterDelay={false}    
        message="Đang tải trang…"
      >
        <Hero lang={lang} onToggleLang={toggle} interClass={inter.className} fredokaClass={fredoka.className}/>
        <div id={skipId} />
        <MemoriesGrid lang={lang} fredokaClass={fredoka.className}/>
        <TimeSection lang={lang} fredokaClass={fredoka.className} interClass={inter.className}/>
        <InfoAndMaps lang={lang} fredokaClass={fredoka.className}/>
        <FooterThanks lang={lang} fredokaClass={fredoka.className}/>
      </NetworkAwareLoader>
    </main>
  );
}
