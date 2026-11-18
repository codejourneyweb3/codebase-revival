import { describe, expect, it } from "vitest";
import { calculateDensity, calculateFeedConsumption, calculateWater } from "./calculations";

describe("KukuThrive frontend calculations", () => {
  it("calculates the specification's 6,000-bird placement ceiling", () => {
    const result = calculateDensity({
      usableAreaM2: 400,
      livePopulation: 5500,
      averageWeightKg: 1.6,
      targetWeightKg: 2,
      houseLimitKgM2: 30,
    });
    expect(result.maximumPlacement).toBe(6000);
    expect(result.projectedKgM2).toBe(27.5);
  });

  it("calculates current biomass density and utilisation from the worked example", () => {
    const result = calculateDensity({
      usableAreaM2: 400,
      livePopulation: 5300,
      averageWeightKg: 1.6,
      targetWeightKg: 2,
      houseLimitKgM2: 30,
    });
    expect(result.currentKgM2).toBeCloseTo(21.2);
    expect(result.utilizationPercent).toBeCloseTo(70.6667);
  });

  it("subtracts leftover and known spillage from drinker refills", () => {
    expect(
      calculateWater({
        drinkers: 20,
        capacityLitres: 10,
        fills: 3,
        leftoverLitres: 20,
        spilledLitres: 5,
      }),
    ).toEqual({ placedLitres: 600, consumedLitres: 575 });
  });

  it("labels feed as an upper bound when leftovers were not recorded", () => {
    expect(calculateFeedConsumption(40, undefined, 1)).toEqual({
      upperBoundKg: 39,
      isUpperBound: true,
    });
  });

  it("subtracts recorded feed leftovers and wastage", () => {
    expect(calculateFeedConsumption(40, 4, 1)).toEqual({ consumedKg: 35, isUpperBound: false });
  });
});
