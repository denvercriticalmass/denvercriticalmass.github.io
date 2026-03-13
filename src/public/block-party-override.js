"use strict";

// Temporary override: Larimer St Block Party on March 29, 2026
// DELETE THIS FILE after March 29, 2026
const BlockPartyOverride = (() => {
  const CUTOFF = new Date(2026, 2, 29, 23, 59, 59, 999);

  const isActive = () => new Date() <= CUTOFF;

  const apply = () => {
    if (!isActive()) return;

    const dayNameEl = document.querySelector("[data-day-name]");
    const meetTimeEl = document.querySelector("[data-meet-time]");
    const rideTimeEl = document.querySelector("[data-ride-time]");
    const winterHoursEl = document.querySelector("[data-winter-hours]");

    if (meetTimeEl) meetTimeEl.innerHTML = "11:00am";
    if (rideTimeEl) rideTimeEl.innerHTML = "11:30am";
    if (dayNameEl) dayNameEl.innerHTML = "Sunday";
    if (winterHoursEl) {
      winterHoursEl.innerHTML =
        '<a href="https://www.events.bike/event/5bf3a5bb-8e68-4597-b156-ae17f520f74d" class="text-blue-500 dark:text-blue-300 hover:underline">Larimer St Block Party</a>';
    }
  };

  return { isActive, apply };
})();

if (typeof window !== "undefined") {
  window.addEventListener("load", BlockPartyOverride.apply);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = BlockPartyOverride;
}
