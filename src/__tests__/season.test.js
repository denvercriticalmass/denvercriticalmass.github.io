import { describe, it, expect } from "vitest";
import {
  getEventTimes,
  getLastTargetDayOfMonth,
  getTargetDayOfWeek,
  isWinterSeason,
} from "../season.js";

describe("getTargetDayOfWeek", () => {
  it("returns 5 (Friday) for May-October", () => {
    expect(getTargetDayOfWeek(4)).toBe(5);
    expect(getTargetDayOfWeek(9)).toBe(5);
  });

  it("returns 0 (Sunday) for November-April", () => {
    expect(getTargetDayOfWeek(10)).toBe(0);
    expect(getTargetDayOfWeek(11)).toBe(0);
    expect(getTargetDayOfWeek(0)).toBe(0);
    expect(getTargetDayOfWeek(1)).toBe(0);
    expect(getTargetDayOfWeek(2)).toBe(0);
    expect(getTargetDayOfWeek(3)).toBe(0);
  });
});

describe("getLastTargetDayOfMonth", () => {
  it("returns last Friday of October 2025", () => {
    const result = getLastTargetDayOfMonth(new Date(2025, 9, 1));
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(31);
    expect(result.getDay()).toBe(5);
  });

  it("returns last Sunday of November 2025", () => {
    const result = getLastTargetDayOfMonth(new Date(2025, 10, 1));
    expect(result.getMonth()).toBe(10);
    expect(result.getDate()).toBe(30);
    expect(result.getDay()).toBe(0);
  });

  it("returns last Sunday of December 2025", () => {
    const result = getLastTargetDayOfMonth(new Date(2025, 11, 1));
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(28);
    expect(result.getDay()).toBe(0);
  });

  it("returns last Sunday of March 2026", () => {
    const result = getLastTargetDayOfMonth(new Date(2026, 2, 1));
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(29);
    expect(result.getDay()).toBe(0);
  });

  it("returns last Sunday of April 2026", () => {
    const result = getLastTargetDayOfMonth(new Date(2026, 3, 1));
    expect(result.getMonth()).toBe(3);
    expect(result.getDate()).toBe(26);
    expect(result.getDay()).toBe(0);
  });

  it("rolls over to next month if past the event", () => {
    const result = getLastTargetDayOfMonth(new Date(2025, 10, 1, 0, 0, 0, 0));
    expect(result.getMonth()).toBe(10);
    expect(result.getDate()).toBe(30);
  });
});

describe("isWinterSeason", () => {
  it("returns true for November-April", () => {
    expect(isWinterSeason(10)).toBe(true);
    expect(isWinterSeason(11)).toBe(true);
    expect(isWinterSeason(0)).toBe(true);
    expect(isWinterSeason(1)).toBe(true);
    expect(isWinterSeason(2)).toBe(true);
    expect(isWinterSeason(3)).toBe(true);
  });

  it("returns false for May-October", () => {
    expect(isWinterSeason(4)).toBe(false);
    expect(isWinterSeason(5)).toBe(false);
    expect(isWinterSeason(6)).toBe(false);
    expect(isWinterSeason(7)).toBe(false);
    expect(isWinterSeason(8)).toBe(false);
    expect(isWinterSeason(9)).toBe(false);
  });
});

describe("getEventTimes", () => {
  it("returns winter times for November-April", () => {
    const november = getEventTimes(10);
    expect(november.dayName).toBe("Sunday");
    expect(november.meetTime).toBe("12:30pm");
    expect(november.rideTime).toBe("1:00pm");

    const april = getEventTimes(3);
    expect(april.dayName).toBe("Sunday");
    expect(april.meetTime).toBe("12:30pm");
    expect(april.rideTime).toBe("1:00pm");
  });

  it("returns summer times for May-October", () => {
    const may = getEventTimes(4);
    expect(may.dayName).toBe("Friday");
    expect(may.meetTime).toBe("6:30pm");
    expect(may.rideTime).toBe("7:00pm");
  });
});

describe("Season Transition", () => {
  it("transitions from October (Friday) to November (Sunday)", () => {
    const october = getLastTargetDayOfMonth(new Date(2025, 9, 1));
    expect(october.getDay()).toBe(5);
    expect(getEventTimes(october.getMonth()).dayName).toBe("Friday");

    const november = getLastTargetDayOfMonth(new Date(2025, 10, 1));
    expect(november.getDay()).toBe(0);
    expect(getEventTimes(november.getMonth()).dayName).toBe("Sunday");
  });

  it("transitions from April (Sunday) to May (Friday)", () => {
    const april = getLastTargetDayOfMonth(new Date(2026, 3, 1));
    expect(april.getDay()).toBe(0);
    expect(getEventTimes(april.getMonth()).dayName).toBe("Sunday");

    const may = getLastTargetDayOfMonth(new Date(2026, 4, 1));
    expect(may.getDay()).toBe(5);
    expect(getEventTimes(may.getMonth()).dayName).toBe("Friday");
  });

  it("transitions from December to January with year rollover", () => {
    const december = getLastTargetDayOfMonth(new Date(2025, 11, 1));
    expect(december.getFullYear()).toBe(2025);
    expect(december.getDate()).toBe(28);

    const january = getLastTargetDayOfMonth(new Date(2026, 0, 1));
    expect(january.getFullYear()).toBe(2026);
    expect(january.getDate()).toBe(25);
  });
});
