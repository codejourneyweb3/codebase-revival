export interface DensityInput {
  usableAreaM2: number;
  livePopulation: number;
  averageWeightKg: number;
  targetWeightKg: number;
  houseLimitKgM2: number;
}

export function calculateDensity(input: DensityInput) {
  const { usableAreaM2, livePopulation, averageWeightKg, targetWeightKg, houseLimitKgM2 } = input;
  if (usableAreaM2 <= 0 || houseLimitKgM2 <= 0) {
    return {
      currentKgM2: 0,
      birdsM2: 0,
      utilizationPercent: 0,
      projectedKgM2: 0,
      maximumPlacement: 0,
    };
  }
  const currentKgM2 = (livePopulation * averageWeightKg) / usableAreaM2;
  const projectedKgM2 = (livePopulation * targetWeightKg) / usableAreaM2;
  return {
    currentKgM2,
    birdsM2: livePopulation / usableAreaM2,
    utilizationPercent: (currentKgM2 / houseLimitKgM2) * 100,
    projectedKgM2,
    maximumPlacement: targetWeightKg > 0 ? (houseLimitKgM2 * usableAreaM2) / targetWeightKg : 0,
  };
}

export function calculateWater(input: {
  drinkers: number;
  capacityLitres: number;
  fills: number;
  leftoverLitres: number;
  spilledLitres: number;
}) {
  const placed =
    Math.max(0, input.drinkers) * Math.max(0, input.capacityLitres) * Math.max(0, input.fills);
  return {
    placedLitres: placed,
    consumedLitres: Math.max(
      0,
      placed - Math.max(0, input.leftoverLitres) - Math.max(0, input.spilledLitres),
    ),
  };
}

export function calculateFeedConsumption(issuedKg: number, leftoverKg?: number, wastedKg = 0) {
  if (leftoverKg === undefined || Number.isNaN(leftoverKg)) {
    return { upperBoundKg: Math.max(0, issuedKg - wastedKg), isUpperBound: true as const };
  }
  return {
    consumedKg: Math.max(0, issuedKg - leftoverKg - wastedKg),
    isUpperBound: false as const,
  };
}
