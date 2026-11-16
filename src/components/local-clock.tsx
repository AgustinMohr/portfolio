"use client";

import { useEffect, useState } from "react";

export function LocalClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Cordoba",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const tick = () => setTime(formatter.format(new Date()));

    tick();
    const interval = window.setInterval(tick, 20000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      className="font-mono text-xs tracking-[0.16em] text-bone"
      suppressHydrationWarning
    >
      {time} <span className="text-ash">ART</span>
    </span>
  );
}
