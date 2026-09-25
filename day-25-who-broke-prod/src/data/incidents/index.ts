import { badDeploy } from "./bad-deploy";
import { cacheStampede } from "./cache-stampede";
import { dbPool } from "./db-pool";
import { memoryLeak } from "./memory-leak";
import { paymentOutage } from "./payment-outage";
import { queueBacklog } from "./queue-backlog";

export const scenarios = [
  badDeploy,
  dbPool,
  cacheStampede,
  queueBacklog,
  paymentOutage,
  memoryLeak,
];

export const incidents = scenarios;

export const scenarioMap = Object.fromEntries(
  scenarios.map((scenario) => [
    scenario.id,
    scenario,
  ]),
);

export function getScenario(id: string) {
  return scenarioMap[id];
}
