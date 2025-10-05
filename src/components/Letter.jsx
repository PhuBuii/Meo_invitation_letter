// components/Letter.jsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Letter (Intro Overlay)
 * - Hiển thị phong bì lắc nhẹ ở trạng thái idle
 * - Người dùng chạm/nhấn → setIsOpened(true) → animation mở → onDone() sau doneAfterMs
 * - Khóa scroll khi overlay đang hiển thị
 * - Hỗ trợ reduce motion cho người dùng nhạy cảm chuyển động
 *
 * Props:
 * - isOpened: boolean — trạng thái đang mở
 * - setIsOpened: fn(boolean)
 * - onDone: fn() — gọi khi kết thúc intro (để parent ẩn overlay)
 * - oncePerSession: (không dùng nữa ở đây, parent dùng localStorage rồi)
 * - doneAfterMs: số ms đợi trước khi gọi onDone (để khớp CSS animation)
 */
export default function Letter({
  isOpened,
  setIsOpened,
  onDone,
  oncePerSession = true,
  doneAfterMs = 2000,
}) {
  const clickedRef = useRef(false);
  const doneTimerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Gọi onDone sau khi mở xong + hết thời gian chờ
  useEffect(() => {
    if (!isOpened) return;
    if (onDone) {
      clearTimeout(doneTimerRef.current);
      doneTimerRef.current = setTimeout(() => {
        onDone?.();
      }, Math.max(0, doneAfterMs));
    }
    return () => clearTimeout(doneTimerRef.current);
  }, [isOpened, onDone, doneAfterMs]);

  // Khóa scroll khi overlay đang hiển thị (chưa mở)
  useEffect(() => {
    if (!isOpened) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "";
      };
    }
    // Khi đã mở, overlay sẽ unmount sau onDone
    return undefined;
  }, [isOpened]);

  // Xử lý tương tác (pointer) để tránh double-fire trên mobile
  const onWrapperPointerDown = (e) => {
    // Ngăn ghost click / double-trigger trên mobile
    e.preventDefault();
    e.stopPropagation();
    if (clickedRef.current || isOpened) return;
    clickedRef.current = true;
    setIsOpened(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      style={{
        background: `
          radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 30% 70%, rgba(176, 196, 222, 0.15) 0%, transparent 50%),
          linear-gradient(135deg,#2c3e50 0%,#3a506b 25%,#435e79 50%,#516b87 75%,#5f7995 100%)
        `,
        backgroundBlendMode: "soft-light, screen, normal",
        filter: "brightness(1.05) contrast(1.05)",
      }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Open invitation letter"
        className={`wap ${isOpened ? "opened" : ""}`}
        onPointerDown={onWrapperPointerDown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onWrapperPointerDown(e);
        }}
        style={{
          pointerEvents: isOpened ? "none" : "auto",
          touchAction: "manipulation",
          outline: "none",
        }}
        // Lắc nhẹ khi idle (nếu chưa mở & không reduce motion)
        initial={{ rotate: 0 }}
        animate={
          prefersReducedMotion || isOpened
            ? { rotate: 0 }
            : { rotate: [0, -1.25, 1.25, 0] }
        }
        transition={
          prefersReducedMotion || isOpened
            ? { duration: 0.2 }
            : { duration: 2, repeat: Infinity, repeatDelay: 1.5 }
        }
      >
        {/* Các phần tử bên trong dựa theo CSS bạn đã có: .lid.one/.lid.two/.envelope/.letter */}
        <div className="lid one"></div>
        <div className="lid two"></div>
        <div className="envelope"></div>

        <motion.div
          className="letter rounded-lg"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isOpened ? 1 : 0,
          }}
          transition={{ duration: 1 }}
        >
          <img
            src={"/letter.png"}
            alt="Invitation letter"
            className="rounded-lg"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
