/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useState } from "react";

export function useNow(interval = 500) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, interval);

    return () => window.clearInterval(id);
  }, [interval]);

  return now;
}