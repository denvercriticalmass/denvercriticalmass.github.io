import { formatDate, getOrdinalSuffix } from "./date.js";
import {
  getEventTimes,
  getLastTargetDayOfMonth,
  getPreviewDate,
  isWinterSeason,
  updateSeasonTheme,
} from "./season.js";

const SNOWFLAKE_COUNT = 35;
const SNOWFLAKE_CHARS = ["❄", "❅", "❆"];

const renderSnowfall = (active) => {
  const container = document.querySelector("[data-snowfall]");
  if (!container) return;
  container.replaceChildren();
  if (!active) return;

  for (let i = 0; i < SNOWFLAKE_COUNT; i += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)];
    flake.style.setProperty("--x", `${Math.random() * 100}%`);
    flake.style.setProperty("--size", `${(0.7 + Math.random() * 1.3).toFixed(2)}rem`);
    flake.style.setProperty("--fall-duration", `${(8 + Math.random() * 12).toFixed(1)}s`);
    flake.style.setProperty("--fall-delay", `-${(Math.random() * 20).toFixed(1)}s`);
    flake.style.setProperty("--drift-duration", `${(3 + Math.random() * 4).toFixed(1)}s`);
    flake.style.setProperty("--drift-delay", `-${(Math.random() * 4).toFixed(1)}s`);
    flake.style.setProperty("--drift", `${((Math.random() - 0.5) * 4).toFixed(2)}rem`);
    container.appendChild(flake);
  }
};

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
  const winter = isWinterSeason(eventMonth);

  updateSeasonTheme(eventMonth);

  monthEl.textContent = month;
  dayEl.textContent = `${day}${getOrdinalSuffix(day)}`;
  yearEl.textContent = String(year);
  dayNameEl.textContent = times.dayName;
  meetTimeEl.textContent = times.meetTime;
  rideTimeEl.textContent = times.rideTime;

  if (winterHoursEl) {
    winterHoursEl.textContent = winter ? "Winter Hours: Sundays" : "";
  }

  renderSnowfall(winter);
};
