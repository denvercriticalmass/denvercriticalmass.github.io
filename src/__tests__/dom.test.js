import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateDOM } from "../dom.js";

describe("updateDOM", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span data-month></span>
      <span data-day-plain></span>
      <span data-year></span>
      <span data-day-name></span>
      <span data-meet-time></span>
      <span data-ride-time></span>
      <div data-winter-hours></div>
    `;
  });

  it("updates DOM elements with correct values", () => {
    updateDOM();

    expect(document.querySelector("[data-month]").textContent).toBeTruthy();
    expect(document.querySelector("[data-day-plain]").textContent).toMatch(/\d+(st|nd|rd|th)/);
    expect(document.querySelector("[data-year]").textContent).toBeTruthy();
    expect(document.querySelector("[data-day-name]").textContent).toMatch(/Friday|Sunday/);
    expect(document.querySelector("[data-meet-time]").textContent).toMatch(/12:30pm|6:30pm/);
    expect(document.querySelector("[data-ride-time]").textContent).toMatch(/1:00pm|7:00pm/);
  });

  it("handles missing DOM elements gracefully", () => {
    document.body.innerHTML = "";

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    updateDOM();
    expect(consoleSpy).toHaveBeenCalledWith("Required DOM elements not found");
    consoleSpy.mockRestore();
  });
});
