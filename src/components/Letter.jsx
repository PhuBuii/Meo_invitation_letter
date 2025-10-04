// Letter.jsx
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Letter = ({
  isOpened,
  setIsOpened,
  onDone,
  oncePerSession = true,
  doneAfterMs = 2000,
}) => {
  const clickedRef = useRef(false);
  const doneTimerRef = useRef(null);

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

  const onWrapperPointerDown = (e) => {
    // Ngăn ghost click / double-trigger trên mobile
    e.preventDefault();
    e.stopPropagation();
    if (clickedRef.current || isOpened) return;
    clickedRef.current = true; // đặt cờ ngay lập tức
    setIsOpened(true);
  };

  return (
    <div
      className="h-[100vh] flex items-center justify-center"
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
        className={`wap ${isOpened ? "opened" : ""}`}
        onPointerDown={onWrapperPointerDown}     // ← thay vì onClick
        style={{ pointerEvents: isOpened ? "none" : "auto", touchAction: "manipulation" }} // ← chặn double-tap
        animate={{
          transition: { duration: 3, delay: 0.2 }, // giảm delay để đỡ cảm giác “lặp”
        }}
      >
        <div className="lid one"></div>
        <div className="lid two"></div>
        <div className="envelope"></div>

        <motion.div
          className="letter rounded-lg"
          animate={{
            opacity: isOpened ? 1 : 0,
            transition: { duration: 1.0 },
          }}
        >
          <img src={"/letter.png"} alt="" className="rounded-lg" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Letter;
