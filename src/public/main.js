"use strict";

// Export functions for testing
const DenverCriticalMass = (() => {
  const formatDate = (date) => {
    const formatter = new Intl.DateTimeFormat("en", { dateStyle: "full" });
    const parts = formatter.formatToParts(date);
    return {
      month: parts.find((p) => p.type === "month").value,
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  const getOrdinalSuffix = (day) => {
    const suffixes = { one: "st", two: "nd", few: "rd", other: "th" };
    const rules = new Intl.PluralRules("en", { type: "ordinal" });
    const ordinal = rules.select(day);
    return suffixes[ordinal] || suffixes.other;
  };

  const formatDayWithOrdinal = (day) => {
    if (typeof day !== "number" || day < 1) {
      throw new Error("Day must be a positive number");
    }
    const suffix = getOrdinalSuffix(day);
    return `${day}<sup>${suffix}</sup>`;
  };

  const getTargetDayOfWeek = (month) => {
    // November (10) through March (2): Sunday (0)
    // April (3) through October (9): Friday (5)
    if (month >= 10 || month <= 2) {
      return 0; // Sunday
    }
    return 5; // Friday
  };

  const getLastTargetDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const targetDay = getTargetDayOfWeek(month);
    const lastDay = new Date(year, month + 1, 0); // Last day of the month

    // Calculate the last occurrence of target day in the month
    let lastTargetDay = new Date(lastDay);
    const daysToSubtract = (lastDay.getDay() - targetDay + 7) % 7;
    lastTargetDay.setDate(lastDay.getDate() - daysToSubtract);

    // Set the time to the end of the day (23:59:59.999)
    lastTargetDay.setHours(23, 59, 59, 999);

    // If the current date is after the last target day, move to the next month
    if (date > lastTargetDay) {
      return getLastTargetDayOfMonth(new Date(year, month + 1, 1));
    }

    return lastTargetDay;
  };

  const isWinterSeason = (month) => {
    return month >= 10 || month <= 2;
  };

  const getEventTimes = (month) => {
    const winter = isWinterSeason(month);
    return {
      dayName: winter ? "Sunday" : "Friday",
      meetTime: winter ? "1:30pm" : "6:30pm",
      rideTime: winter ? "2:00pm" : "7:00pm",
    };
  };

  const updateDOM = () => {
    const monthEl = document.querySelector("[data-month]");
    const dayEl = document.querySelector("[data-day]");
    const yearEl = document.querySelector("[data-year]");
    const dayNameEl = document.querySelector("[data-day-name]");
    const meetTimeEl = document.querySelector("[data-meet-time]");
    const rideTimeEl = document.querySelector("[data-ride-time]");

    if (!monthEl || !dayEl || !yearEl || !dayNameEl || !meetTimeEl || !rideTimeEl) {
      console.error("Required DOM elements not found");
      return;
    }

    const now = new Date();
    const lastTargetDay = getLastTargetDayOfMonth(now);
    const { month, day, year } = formatDate(lastTargetDay);
    const dayWithSuffix = formatDayWithOrdinal(day);
    const targetMonth = lastTargetDay.getMonth();
    const times = getEventTimes(targetMonth);

    monthEl.innerHTML = month;
    dayEl.innerHTML = dayWithSuffix;
    yearEl.innerHTML = year;
    dayNameEl.innerHTML = times.dayName;
    meetTimeEl.innerHTML = times.meetTime;
    rideTimeEl.innerHTML = times.rideTime;
  };

  return {
    formatDate,
    getOrdinalSuffix,
    formatDayWithOrdinal,
    getTargetDayOfWeek,
    getLastTargetDayOfMonth,
    isWinterSeason,
    getEventTimes,
    updateDOM,
  };
})();

// Initialize on load
if (typeof window !== "undefined") {
  window.addEventListener("load", DenverCriticalMass.updateDOM);
}

// Export for testing (CommonJS and ES modules)
if (typeof module !== "undefined" && module.exports) {
  module.exports = DenverCriticalMass;
}
if (typeof window !== "undefined") {
  window.DenverCriticalMass = DenverCriticalMass;
}
