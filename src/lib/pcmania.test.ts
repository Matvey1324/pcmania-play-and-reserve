import { describe, expect, it } from "vitest";
import { calcTotals, DURATIONS, isValidPromo, seatPrice, ZONES } from "./pcmania";

const zone = (id: string) => ZONES.find((z) => z.id === id)!;
const dur = (id: string) => DURATIONS.find((d) => d.id === id)!;

describe("PCMANIA pricing", () => {
  it("promo code PCMANIA gives 10% off the whole order", () => {
    expect(calcTotals(1000, 500, true)).toMatchObject({ discount: 150, total: 1350 });
  });
  it("no discount without promo", () => {
    expect(calcTotals(1000, 500, false).total).toBe(1500);
  });
  it("promo code is case-insensitive and rejects other codes", () => {
    expect(isValidPromo(" pcmania ")).toBe(true);
    expect(isValidPromo("PCMANIA20")).toBe(false);
  });
  it("seat price scales with duration", () => {
    expect(seatPrice(zone("standard"), dur("1h"))).toBe(150);
    expect(seatPrice(zone("standard"), dur("3h"))).toBe(405);
  });
});
