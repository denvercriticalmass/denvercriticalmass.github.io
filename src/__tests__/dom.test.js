import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateDOM } from "../dom.js";

describe("updateDOM", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span data-month></span>
      <span data-day></span>
      <span data-year></span>
      <span data-day-name></span>
      <span data-meet-time></span>
      <span data-ride-time></span>
    `;
  });

  it("updates DOM elements with correct values", () => {
    updateDOM();

    expect(document.querySelector("[data-month]").innerHTML).toBeTruthy();
    expect(document.querySelector("[data-day]").innerHTML).toContain("sup");
    expect(document.querySelector("[data-year]").innerHTML).toBeTruthy();
    expect(document.querySelector("[data-day-name]").innerHTML).toMatch(/Friday|Sunday/);
    expect(document.querySelector("[data-meet-time]").innerHTML).toMatch(/12:30pm|6:30pm/);
    expect(document.querySelector("[data-ride-time]").innerHTML).toMatch(/1:00pm|7:00pm/);
  });

  it("handles missing DOM elements gracefully", () => {
    document.body.innerHTML = "";

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    updateDOM();
    expect(consoleSpy).toHaveBeenCalledWith("Required DOM elements not found");
    consoleSpy.mockRestore();
  });
});
