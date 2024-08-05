"use strict";
(() => {
  onload = () => {
    const monthEl = document.querySelector("[data-month]");
    const dayEl = document.querySelector("[data-day]");
    const yearEl = document.querySelector("[data-year]");

    const fullFormat = new Intl.DateTimeFormat("en", { dateStyle: "full" });
    const now = new Date();
    const parts = fullFormat.formatToParts(now);
    const monthName = parts.find((p) => p.type === "month").value;

    const ordinalSuffixes = {
      en: {
        one: "st",
        two: "nd",
        few: "rd",
        other: "th",
      },
    };

    class OrdinalFormat {
      #rules;
      #suffixes;

      constructor(locale) {
        if (!(locale in ordinalSuffixes))
          throw new Error(`Unhandled locale: ${locale}`);
        this.#suffixes = ordinalSuffixes[locale];
        this.#rules = new Intl.PluralRules(locale, { type: "ordinal" });
      }

      withOrdinalSuffix(x) {
        if (typeof x != "number")
          throw new TypeError(`Expected Number but received ${typeof x}`);
        if (x < 1)
          throw new RangeError(`Expected a number > 0 but received ${x}`);
        const ordinal = this.#rules.select(x);
        if ((!ordinal) in this.#suffixes)
          throw new Error(`Unexpected ordinal ${ordinal}`);
        const suffix = this.#suffixes[ordinal];
        return `${x}<sup>${suffix}</sup>`;
      }
    }

    const lastFridayOfMonth = (year, month) => {
      const lastDay = new Date(year, month + 1, 0);

      if (lastDay.getDay() < 5) lastDay.setDate(lastDay.getDate() - 7);

      lastDay.setDate(lastDay.getDate() - (lastDay.getDay() - 5));

      return lastDay;
    };

    const day = lastFridayOfMonth(now.getFullYear(), now.getMonth()).getDate();

    const dayWithSuffix = new OrdinalFormat("en").withOrdinalSuffix(
      Number(day)
    );

    monthEl.innerHTML = monthName;
    dayEl.innerHTML = dayWithSuffix;
    yearEl.innerHTML = now.getFullYear();
  };
})();
