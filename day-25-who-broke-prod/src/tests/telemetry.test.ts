import {
  describe,
  expect,
  it,
} from "vitest";
import { badDeploy } from "@/data/incidents/bad-deploy";
import { createRun } from "@/lib/simulation";
import { generateMetricSeries } from "@/lib/telemetry";

describe("telemetry generation", () => {
  it("is deterministic for the same scenario", () => {
    const run = createRun(badDeploy);

    const first =
      generateMetricSeries(
        badDeploy,
        badDeploy.metrics[0],
        run,
      );

    const second =
      generateMetricSeries(
        badDeploy,
        badDeploy.metrics[0],
        run,
      );

    expect(first).toEqual(second);
  });

  it("shows degradation around incident start", () => {
    const run = createRun(badDeploy);

    const data =
      generateMetricSeries(
        badDeploy,
        badDeploy.metrics[0],
        run,
      );

    const early =
      data.find(
        (point) => point.t === -900,
      )?.value ?? 0;

    const late =
      data.find(
        (point) => point.t === 0,
      )?.value ?? 0;

    expect(late).toBeGreaterThan(
      early,
    );
  });
});
