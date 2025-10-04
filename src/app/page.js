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

  // A) State điều khiển overlay + trạng thái mở
  const [introDone, setIntroDone] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  // B) Tránh hydration mismatch
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const isPending = false; // logic thật của bạn

  if (!hydrated) return <main className={`${inter.className} min-h-screen`} />;

  return (
    <main className={`${inter.className} relative min-h-screen`}>
      {/* Chỉ render overlay khi chưa xong intro */}
      {!introDone && (
        <Letter
          isOpened={isOpened}               // <-- TRUYỀN XUỐNG
          setIsOpened={setIsOpened}         // <-- TRUYỀN XUỐNG
          onDone={() => setIntroDone(true)} // gọi khi animation hoàn tất
          oncePerSession={true}             // muốn test lại thì xóa key sessionStorage
          doneAfterMs={2500}
        />
      )}

      {/* App chính hiển thị sau khi introDone */}
      {introDone && (
        <NetworkAwareLoader active={isPending} thresholdMs={650} forceAfterDelay={false} message="Đang tải trang…">
          <Hero lang={lang} onToggleLang={toggle} interClass={inter.className} fredokaClass={fredoka.className}/>
          <div id={skipId} />
          <MemoriesGrid lang={lang} fredokaClass={fredoka.className}/>
          <TimeSection lang={lang} fredokaClass={fredoka.className} interClass={inter.className}/>
          <InfoAndMaps lang={lang} fredokaClass={fredoka.className}/>
          <FooterThanks lang={lang} fredokaClass={fredoka.className}/>
        </NetworkAwareLoader>
      )}
    </main>
  );
}
