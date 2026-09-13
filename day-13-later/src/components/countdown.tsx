import {
  useEffect,
  useState,
} from "react";

import { getTimeRemaining } from "../lib/time";

type Props = {
  timestamp: number;
  suffix?: string;
  showSeconds?: boolean;
};

export function Countdown({
  timestamp,
  suffix,
  showSeconds = false,
}: Props) {
  const [remaining, setRemaining] =
    useState(() =>
      getTimeRemaining(timestamp, showSeconds),
    );

  useEffect(() => {
    const update = () => {
      setRemaining(
        getTimeRemaining(timestamp, showSeconds),
      );
    };

    update();

    const interval = window.setInterval(
      update,
      showSeconds ? 1_000 : 30_000,
    );

    return () =>
      window.clearInterval(interval);
  }, [timestamp, showSeconds]);

  return (
    <span>
      {remaining}
      {suffix}
    </span>
  );
}
