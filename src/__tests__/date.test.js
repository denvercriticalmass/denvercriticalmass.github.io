import { describe, it, expect } from "vitest";
import { formatDate, formatDayWithOrdinal, getOrdinalSuffix } from "../date.js";

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

describe("formatDayWithOrdinal", () => {
  it("formats day with correct ordinal suffix", () => {
    expect(formatDayWithOrdinal(1)).toBe("1<sup>st</sup>");
    expect(formatDayWithOrdinal(2)).toBe("2<sup>nd</sup>");
    expect(formatDayWithOrdinal(3)).toBe("3<sup>rd</sup>");
    expect(formatDayWithOrdinal(4)).toBe("4<sup>th</sup>");
    expect(formatDayWithOrdinal(31)).toBe("31<sup>st</sup>");
  });

  it("throws error for invalid input", () => {
    expect(() => formatDayWithOrdinal(0)).toThrow("Day must be a positive number");
    expect(() => formatDayWithOrdinal(-1)).toThrow("Day must be a positive number");
    expect(() => formatDayWithOrdinal("1")).toThrow("Day must be a positive number");
  });
});
