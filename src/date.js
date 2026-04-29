const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });
const ordinalSuffixes = { one: "st", two: "nd", few: "rd", other: "th" };

export const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat("en", { dateStyle: "full" });
  const parts = formatter.formatToParts(date);
  return {
    month: parts.find((p) => p.type === "month").value,
    day: date.getDate(),
    year: date.getFullYear(),
  };
};

export const getOrdinalSuffix = (day) =>
  ordinalSuffixes[ordinalRules.select(day)] ?? ordinalSuffixes.other;

export const formatDayWithOrdinal = (day) => {
  if (typeof day !== "number" || day < 1) {
    throw new Error("Day must be a positive number");
  }
  return `${day}<sup>${getOrdinalSuffix(day)}</sup>`;
};
