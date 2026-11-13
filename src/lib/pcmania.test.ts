import { describe, expect, it } from "vitest";
import { calcTotals, formatUah, DURATIONS, isValidPromo, seatPrice, ZONES } from "./pcmania";

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
  it("hourly rates are 100 / 160 / 250 ₴ for Стандарт / VIP / Elite", () => {
    expect([zone("standard").rate, zone("vip").rate, zone("elite").rate]).toEqual([100, 160, 250]);
  });
  it("prices are shown in hryvnia", () => {
    expect(formatUah(1500)).toContain("₴");
  });
  it("seat price scales with duration", () => {
    expect(seatPrice(zone("standard"), dur("1h"))).toBe(100);
    expect(seatPrice(zone("standard"), dur("3h"))).toBe(270);
  });
});
