import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Letter = ({
  isOpened,
  setIsOpened,
  onDone, // optional: callback khi intro hoàn tất (để render app chính)
  oncePerSession = true, // chỉ hiện 1 lần mỗi session
  doneAfterMs = 2500, // thời gian chờ trước khi gọi onDone sau khi mở
}) => {
  const clickedRef = useRef(false);
  const doneTimerRef = useRef(null);

  // Khi chuyển sang opened, lên lịch gọi onDone (nếu có)
  useEffect(() => {
    if (!isOpened) return;

    // lên lịch gọi onDone sau khi animation chạy xong
    if (onDone) {
      clearTimeout(doneTimerRef.current);
      doneTimerRef.current = setTimeout(() => {
        onDone?.();
      }, Math.max(0, doneAfterMs));
    }

    return () => clearTimeout(doneTimerRef.current);
  }, [isOpened, oncePerSession, onDone, doneAfterMs]);

  const onWrapperClick = () => {
    // chặn spam click & không làm gì nếu đã mở
    if (clickedRef.current || isOpened) return;
    clickedRef.current = true;
    setIsOpened(true);
  };

  return (
    <div
      className="h-[100vh] flex items-center justify-center "
      style={{
        background: `
        radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 30% 70%, rgba(176, 196, 222, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, 
          #2c3e50 0%,
          #3a506b 25%,
          #435e79 50%,
          #516b87 75%,
          #5f7995 100%
        )
      `,
        backgroundBlendMode: "soft-light, screen, normal",
        filter: "brightness(1.05) contrast(1.05)",
      }}
    >
      <motion.div
        className={`wap ${isOpened ? "opened" : ""}`}
        onClick={onWrapperClick}
        // giữ nguyên UI/animation, chỉ bổ sung pointer-events khi đã mở
        style={{ pointerEvents: isOpened ? "none" : "auto" }}
        animate={{
          opacity: isOpened ? 0 : 1,
          transition: {
            duration: 1,
            delay: 2,
          },
        }}
      >
        <div className="lid one"></div>
        <div className="lid two"></div>
        <div className="envelope"></div>
        <motion.div
          className="letter rounded-lg"
          animate={{
            opacity: isOpened ? 1 : 0,
            transition: {
              duration: 1.25,
            },
          }}
        >
          <img src={"/letter.png"} alt="" className="rounded-lg" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Letter;
