// components/Loading.jsx
"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Loading (Overlay/Block)
 * - fullscreen: phủ toàn màn hình & khóa scroll body
 * - message/tip/gifSrc: tuỳ biến nội dung
 * - A11y: role=progressbar + aria-live
 * - Motion-safe: tôn trọng prefers-reduced-motion
 */
export default function Loading({
  fullscreen = true,
  message = "Đang tải nội dung…",
  tip = "Mạng có thể yếu. Hãy kiên nhẫn trong giây lát nhé!",
  gifSrc = "/Poodle.gif",
  className = "",
}) {
  const [slow, setSlow] = useState(false);
  const [dots, setDots] = useState(0);
  const [progress, setProgress] = useState(12);
  const liveRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  // Khóa scroll khi fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [fullscreen]);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(!!mq?.matches);
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  // Nhận biết mạng yếu (nếu trình duyệt hỗ trợ)
  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const judge = () => {
      if (!conn) return setSlow(false);
      const lowType = ["slow-2g", "2g"];
      const isLow =
        lowType.includes(conn.effectiveType) ||
        conn.saveData ||
        (conn.downlink && conn.downlink < 1.5) ||
        (conn.rtt && conn.rtt > 300);
      setSlow(!!isLow);
    };
    judge();
    conn?.addEventListener?.("change", judge);
    return () => conn?.removeEventListener?.("change", judge);
  }, []);

  // Progress giả (không chạm 100%)
  useEffect(() => {
    let timerId;
    const tick = () => {
      setProgress((p) => {
        const accel = p < 70 ? 1.5 : p < 90 ? 0.6 : 0.15;
        return Math.min(p + accel, 97);
      });
      timerId = setTimeout(tick, 180);
    };
    tick();
    return () => clearTimeout(timerId);
  }, []);

  // “…” sau message
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);

  const containerCls = useMemo(
    () =>
      [
        "relative overflow-hidden",
        fullscreen ? "fixed inset-0 z-[9999]" : "w-full h-full",
        "bg-[#e5e6e6]",
        "flex items-center justify-center",
        "select-none",
        className,
      ].join(" "),
    [fullscreen, className],
  );

  const valNow = Math.round(progress);

  return (
    <div className={containerCls} role="status" aria-live="polite" aria-busy="true">
      {/* CSS nội bộ cho animation */}
      <style>{`
        .ldg-shimmer:before {
          content: "";
          position: absolute;
          inset: -100%;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
          animation: sweep 1800ms ease-in-out infinite;
        }
        @keyframes sweep {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(130%); }
        }
        .breath { animation: breath 1600ms ease-in-out infinite; }
        @keyframes breath {
          0%,100% { transform: scale(1); filter: drop-shadow(0 6px 20px rgba(0,0,0,.12)); }
          50% { transform: scale(1.025); filter: drop-shadow(0 10px 26px rgba(0,0,0,.18)); }
        }
        .bar { animation: barFlow 1200ms ease-in-out infinite; }
        @keyframes barFlow {
          0% { left: -20%; width: 20%; }
          50% { left: 20%; width: 60%; }
          100% { left: 100%; width: 20%; }
        }
        .fadeInUp { animation: fadeInUp .5s ease both; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ldg-shimmer:before, .breath, .bar, .fadeInUp { animation: none !important; }
        }
      `}</style>

      {/* Nền shimmer */}
      <div className="ldg-shimmer pointer-events-none absolute inset-0 opacity-50" />

      {/* Card */}
      <div
        className="relative mx-4 w-[min(560px,92vw)] rounded-3xl bg-white/80 backdrop-blur-md shadow-[0_15px_50px_rgba(2,6,23,.18)] ring-1 ring-black/5 p-6 fadeInUp"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valNow}
        aria-valuetext={`${message} (${valNow}%)`}
      >
        {/* GIF + breath (hoặc tĩnh khi reduced motion) */}
        <div className="grid place-items-center">
          <div className={["rounded-2xl overflow-hidden ring-1 ring-black/5", reduced ? "" : "breath"].join(" ")}>
            <Image
              src={gifSrc}
              alt="Đang tải…"
              width={900}
              height={1200}
              className="h-[220px] w-[320px] object-contain sm:h-[260px] sm:w-[360px] bg-white"
              priority={fullscreen}        
            />
          </div>
        </div>

        {/* Thông điệp */}
        <p className="mt-5 text-center text-gray-800 text-[15px]">
          {message}
          <span aria-hidden="true">{".".repeat(dots)}</span>
        </p>

        {/* Thanh progress (indeterminate + % giả) */}
        <div className="mt-4 h-2 w-full rounded-full bg-gray-200 overflow-hidden relative">
          <div
            className={["absolute top-0 h-full rounded-full bg-gray-900/70", reduced ? "" : "bar"].join(" ")}
            style={{ width: `${Math.max(12, Math.min(progress, 97))}%` }}
          />
        </div>

        {/* Cảnh báo mạng yếu */}
        {slow && (
          <div className="mt-3 text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ⚠️ {tip}
          </div>
        )}

        <span ref={liveRef} className="sr-only">{message}</span>
      </div>
    </div>
  );
}
