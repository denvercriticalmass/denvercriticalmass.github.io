const SUNDAY = 0;
const FRIDAY = 5;

export const isWinterSeason = (month) => month >= 10 || month <= 3;

export const getTargetDayOfWeek = (month) => (isWinterSeason(month) ? SUNDAY : FRIDAY);

export const getLastTargetDayOfMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const targetDay = getTargetDayOfWeek(month);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const result = new Date(lastDayOfMonth);
  const daysToSubtract = (lastDayOfMonth.getDay() - targetDay + 7) % 7;
  result.setDate(lastDayOfMonth.getDate() - daysToSubtract);
  result.setHours(23, 59, 59, 999);

  if (date > result) {
    return getLastTargetDayOfMonth(new Date(year, month + 1, 1));
  }
  return result;
};

export const getEventTimes = (month) => {
  const winter = isWinterSeason(month);
  return {
    dayName: winter ? "Sunday" : "Friday",
    meetTime: winter ? "12:30pm" : "6:30pm",
    rideTime: winter ? "1:00pm" : "7:00pm",
  };
};

export const getPreviewDate = () => {
  if (typeof window === "undefined" || !window.location) return null;
  const localPreviewHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const preview = new URLSearchParams(window.location.search).get("preview");
  return localPreviewHost && preview === "winter" ? new Date(2026, 0, 15) : null;
};

export const updateSeasonTheme = (month) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.season = isWinterSeason(month) ? "winter" : "summer";
};
