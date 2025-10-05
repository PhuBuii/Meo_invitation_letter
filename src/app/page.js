// app/page.jsx
"use client";

import { Inter, Fredoka } from "next/font/google";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useLang from "@/hooks/useLang";
import NetworkAwareLoader from "@/components/NetworkAwareLoader";
import Letter from "@/components/Letter";

const Hero = dynamic(() => import("@/components/Hero"), { ssr: true });
const MemoriesGrid = dynamic(() => import("@/components/MemoriesGrid"), {
  ssr: true,
  loading: () => (
    <div className="h-[300px] w-full animate-pulse bg-gray-200 rounded-2xl" />
  ),
});
const TimeSection = dynamic(() => import("@/components/TimeSection"), {
  ssr: true,
});
const InfoAndMaps = dynamic(() => import("@/components/InfoAndMaps"), {
  ssr: true,
  loading: () => (
    <div className="h-[360px] w-full animate-pulse bg-gray-200 rounded-2xl" />
  ),
});
const FooterThanks = dynamic(() => import("@/components/FooterThanks"), {
  ssr: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const STORAGE_KEY = "intro_letter_opened_v1";

export default function Page() {
  const { lang, toggle } = useLang();

  // Tránh hydration mismatch (đợi client mount)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Đợi đọc localStorage xong thì mới quyết định render overlay
  const [ready, setReady] = useState(false);

  // Trạng thái overlay và animation của phong bì
  const [introDone, setIntroDone] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  // Đọc cờ đã mở thư trước đây (sau hydrate)
  useEffect(() => {
    if (!hydrated) return;
    let openedBefore = false;
    try {
      openedBefore = window.localStorage?.getItem(STORAGE_KEY) === "1";
    } catch {
      openedBefore = false;
    }
    setIntroDone(openedBefore);
    setIsOpened(openedBefore);
    setReady(true);
  }, [hydrated]);

  if (!hydrated || !ready) {
    return <main className={`${inter.className} min-h-screen`} />;
  }

  const isPending = false; // thay bằng logic thật của bạn

  // Nút “Xem lại intro”
  const handleResetIntro = () => {
    try {
      window.localStorage?.removeItem(STORAGE_KEY);
    } catch {}
    setIntroDone(false);
    setIsOpened(false);
  };

  return (
    <main className={`${inter.className} relative min-h-screen`}>
      {/* 1) Intro overlay: chỉ hiện nếu chưa từng mở */}
      {!introDone && (
        <Letter
          isOpened={isOpened}
          setIsOpened={(v) => {
            setIsOpened(v);
            if (v) {
              try {
                window.localStorage?.setItem(STORAGE_KEY, "1");
              } catch {}
            }
          }}
          onDone={() => {
            setIntroDone(true);
            try {
              window.localStorage?.setItem(STORAGE_KEY, "1");
            } catch {}
          }}
          oncePerSession={false}
          doneAfterMs={2500}
        />
      )}

      {/* 2) Nội dung chính */}
      <NetworkAwareLoader
        active={isPending}
        thresholdMs={650}
        forceAfterDelay={false}
        message="Đang tải trang…"
      >
        <Hero
          lang={lang}
          onToggleLang={toggle}
          interClass={inter.className}
          fredokaClass={fredoka.className}
        />

        <div id="main-content" />

        <MemoriesGrid lang={lang} fredokaClass={fredoka.className} />

        <TimeSection
          lang={lang}
          fredokaClass={fredoka.className}
          interClass={inter.className}
        />

        <InfoAndMaps lang={lang} fredokaClass={fredoka.className} />

        <FooterThanks lang={lang} fredokaClass={fredoka.className} />

        {/* 3) Nút “Xem lại phần mở thư” — chỉ hiển thị khi đã hoàn tất intro */}
        {introDone && (
          <div className="fixed top-4 right-4 z-50">
            <div className="absolute inset-0 size-8/10 left-1/2 top-1/2 -translate-1/2 bg-pink-200 rounded-full transition-all animate-ping"></div>
            <button
              onClick={handleResetIntro}
              className="bg-pink-400 hover:bg-pink-500 text-white text-sm p-2  rounded-full shadow-md transition-all duration-200"
            >
              💌
            </button>
          </div>
        )}
      </NetworkAwareLoader>
    </main>
  );
}
