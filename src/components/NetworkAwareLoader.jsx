// components/NetworkAwareLoader.jsx
"use client";
import { useEffect, useState } from "react";
import Loading from "./Loading";

/**
 * NetworkAwareLoader
 * - active: bạn bật khi đang pending (fetch, transition, v.v.)
 * - thresholdMs: chờ X ms rồi mới cho phép show (tránh flash)
 * - forceAfterDelay: nếu true, sau ngưỡng sẽ show dù mạng không yếu
 */
export default function NetworkAwareLoader({
  active = true,
  thresholdMs = 650,
  forceAfterDelay = false,
  message = "Đang tải nội dung…",
  children,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return setShow(false);

    let id = setTimeout(() => {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const lowType = ["slow-2g", "2g"];
      const isLow =
        !!conn &&
        (lowType.includes(conn.effectiveType) ||
          conn.saveData ||
          (conn.downlink && conn.downlink < 1.5) ||
          (conn.rtt && conn.rtt > 300));

      setShow(isLow || forceAfterDelay);
    }, thresholdMs);

    return () => clearTimeout(id);
  }, [active, thresholdMs, forceAfterDelay]);

  return (
    <>
      {children}
      {active && show && <Loading fullscreen message={message} />}
    </>
  );
}
