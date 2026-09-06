export function getFlowMultiplier(flow: number) {
  if (flow >= 12) return 2;
  if (flow >= 8) return 1.6;
  if (flow >= 5) return 1.4;
  if (flow >= 3) return 1.2;

  return 1;
}

export function passengerScore(
  difficulty: number,
  nextFlow: number,
  fastDelivery: boolean,
) {
  const baseFare = 100;
  const flow = getFlowMultiplier(nextFlow);
  const speedBonus = fastDelivery ? 60 : 0;

  return Math.round(
    baseFare * difficulty * flow + speedBonus,
  );
}

export function efficiency(
  delivered: number,
  total: number,
) {
  if (total <= 0) return 100;

  return Math.round((delivered / total) * 100);
}