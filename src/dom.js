import { formatDate, getOrdinalSuffix } from "./date.js";
import {
  getEventTimes,
  getLastTargetDayOfMonth,
  getPreviewDate,
  isWinterSeason,
  updateSeasonTheme,
} from "./season.js";

export const updateDOM = () => {
  const monthEl = document.querySelector("[data-month]");
  const dayEl = document.querySelector("[data-day-plain]");
  const yearEl = document.querySelector("[data-year]");
  const dayNameEl = document.querySelector("[data-day-name]");
  const meetTimeEl = document.querySelector("[data-meet-time]");
  const rideTimeEl = document.querySelector("[data-ride-time]");
  const winterHoursEl = document.querySelector("[data-winter-hours]");

  if (!monthEl || !dayEl || !yearEl || !dayNameEl || !meetTimeEl || !rideTimeEl) {
    console.error("Required DOM elements not found");
    return;
  }

  const now = getPreviewDate() || new Date();
  const eventDate = getLastTargetDayOfMonth(now);
  const { month, day, year } = formatDate(eventDate);
  const eventMonth = eventDate.getMonth();
  const times = getEventTimes(eventMonth);

  updateSeasonTheme(eventMonth);

  monthEl.textContent = month;
  dayEl.textContent = `${day}${getOrdinalSuffix(day)}`;
  yearEl.textContent = String(year);
  dayNameEl.textContent = times.dayName;
  meetTimeEl.textContent = times.meetTime;
  rideTimeEl.textContent = times.rideTime;

  if (winterHoursEl) {
    winterHoursEl.textContent = isWinterSeason(eventMonth) ? "Winter Hours: Sundays" : "";
  }
};
