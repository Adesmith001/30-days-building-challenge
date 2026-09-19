export function createLongTaskMonitor() {
  let count = 0;

  let observer:
    PerformanceObserver |
    null = null;

  const supported =
    typeof PerformanceObserver !==
      "undefined" &&
    PerformanceObserver
      .supportedEntryTypes
      ?.includes(
        "longtask",
      );

  return {
    start() {
      if (!supported) {
        return;
      }

      observer =
        new PerformanceObserver(
          (list) => {
            count +=
              list
                .getEntries()
                .length;
          },
        );

      observer.observe({
        type: "longtask",
      } as PerformanceObserverInit);
    },

    stop() {
      observer?.disconnect();

      return supported
        ? count
        : undefined;
    },
  };
}