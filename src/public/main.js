"use strict";

(() => {
  window.addEventListener("load", () => {
    const monthEl = document.querySelector("[data-month]");
    const dayEl = document.querySelector("[data-day]");
    const yearEl = document.querySelector("[data-year]");

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

    const getLastFridayOfMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const lastDay = new Date(year, month + 1, 0); // Last day of the month

      // Calculate the last Friday of the month
      let lastFriday = new Date(lastDay);
      lastFriday.setDate(lastDay.getDate() - ((lastDay.getDay() + 2) % 7));

      // Set the time to the end of the day (23:59:59.999)
      lastFriday.setHours(23, 59, 59, 999);

      // If the current date is after the last Friday, move to the next month
      if (date > lastFriday) {
        return getLastFridayOfMonth(new Date(year, month + 1, 1));
      }

      return lastFriday;
    };

    const now = new Date();
    const lastFriday = getLastFridayOfMonth(now);
    const { month, day, year } = formatDate(lastFriday);
    const dayWithSuffix = formatDayWithOrdinal(day);

    monthEl.innerHTML = month;
    dayEl.innerHTML = dayWithSuffix;
    yearEl.innerHTML = year;
  });
})();
