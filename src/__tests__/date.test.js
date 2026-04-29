import { describe, it, expect } from "vitest";
import { formatDate, getOrdinalSuffix } from "../date.js";

describe("formatDate", () => {
  it("formats a date correctly", () => {
    const result = formatDate(new Date(2025, 9, 31));
    expect(result.month).toBe("October");
    expect(result.day).toBe(31);
    expect(result.year).toBe(2025);
  });

  it("formats a winter date correctly", () => {
    const result = formatDate(new Date(2025, 0, 15));
    expect(result.month).toBe("January");
    expect(result.day).toBe(15);
    expect(result.year).toBe(2025);
  });
});

describe("getOrdinalSuffix", () => {
  it('returns "st" for 1, 21, 31', () => {
    expect(getOrdinalSuffix(1)).toBe("st");
    expect(getOrdinalSuffix(21)).toBe("st");
    expect(getOrdinalSuffix(31)).toBe("st");
  });

  it('returns "nd" for 2, 22', () => {
    expect(getOrdinalSuffix(2)).toBe("nd");
    expect(getOrdinalSuffix(22)).toBe("nd");
  });

  it('returns "rd" for 3, 23', () => {
    expect(getOrdinalSuffix(3)).toBe("rd");
    expect(getOrdinalSuffix(23)).toBe("rd");
  });

  it('returns "th" for 4-20 and others', () => {
    expect(getOrdinalSuffix(4)).toBe("th");
    expect(getOrdinalSuffix(11)).toBe("th");
    expect(getOrdinalSuffix(12)).toBe("th");
    expect(getOrdinalSuffix(13)).toBe("th");
    expect(getOrdinalSuffix(20)).toBe("th");
  });
});
