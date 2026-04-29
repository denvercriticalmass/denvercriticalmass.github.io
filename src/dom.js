import { formatDate, formatDayWithOrdinal, getOrdinalSuffix } from "./date.js";
import {
  getEventTimes,
  getLastTargetDayOfMonth,
  getPreviewDate,
  isWinterSeason,
  updateSeasonTheme,
} from "./season.js";

export const updateDOM = () => {
  const monthEl = document.querySelector("[data-month]");
  const dayEl = document.querySelector("[data-day]");
  const dayPlainEl = document.querySelector("[data-day-plain]");
  const yearEl = document.querySelector("[data-year]");
  const dayNameEl = document.querySelector("[data-day-name]");
  const meetTimeEl = document.querySelector("[data-meet-time]");
  const rideTimeEl = document.querySelector("[data-ride-time]");
  const winterHoursEl = document.querySelector("[data-winter-hours]");

  if (!monthEl || (!dayEl && !dayPlainEl) || !yearEl || !dayNameEl || !meetTimeEl || !rideTimeEl) {
    console.error("Required DOM elements not found");
    return;
  }

  const now = getPreviewDate() || new Date();
  const eventDate = getLastTargetDayOfMonth(now);
  const { month, day, year } = formatDate(eventDate);
  const eventMonth = eventDate.getMonth();
  const times = getEventTimes(eventMonth);

  updateSeasonTheme(eventMonth);

  monthEl.innerHTML = month;
  if (dayEl) dayEl.innerHTML = formatDayWithOrdinal(day);
  if (dayPlainEl) dayPlainEl.textContent = `${day}${getOrdinalSuffix(day)}`;
  yearEl.innerHTML = year;
  dayNameEl.innerHTML = times.dayName;
  meetTimeEl.innerHTML = times.meetTime;
  rideTimeEl.innerHTML = times.rideTime;

  if (winterHoursEl) {
    winterHoursEl.innerHTML = isWinterSeason(eventMonth) ? "Winter Hours: Sundays" : "";
  }
};
