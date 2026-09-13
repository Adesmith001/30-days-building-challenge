import {
  useEffect,
  useState,
} from "react";

import { getTimeRemaining } from "../lib/time";

type Props = {
  timestamp: number;
  suffix?: string;
};

export function Countdown({
  timestamp,
  suffix,
}: Props) {
  const [remaining, setRemaining] =
    useState(() =>
      getTimeRemaining(timestamp),
    );

  useEffect(() => {
    const update = () => {
      setRemaining(
        getTimeRemaining(timestamp),
      );
    };

    update();

    const interval =
      window.setInterval(update, 30_000);

    return () =>
      window.clearInterval(interval);
  }, [timestamp]);

  return (
    <span>
      {remaining}
      {suffix}
    </span>
  );
}