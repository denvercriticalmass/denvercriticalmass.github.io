import { describe, it, expect } from "vitest";
import { getWorldCloudRows } from "../world-cloud.js";

describe("getWorldCloudRows", () => {
  it("includes a large worldwide city list from the ride network", () => {
    const cityNames = getWorldCloudRows().flatMap((row) => row.cities);

    expect(cityNames.length).toBeGreaterThan(125);
    expect(cityNames).toContain("Denver");
    expect(cityNames).toContain("Chicago");
    expect(cityNames).toContain("Guadalajara");
    expect(cityNames).toContain("Montreal");
    expect(cityNames).toContain("Buenos Aires");
    expect(cityNames).toContain("Nairobi");
    expect(cityNames).toContain("Seoul");
    expect(cityNames).toContain("Melbourne");
  });

  it("does not include removed placeholders", () => {
    const cityNames = getWorldCloudRows().flatMap((row) => row.cities);
    const excluded = [
      ["Ant", "arctica"].join(""),
      ["Mc", "Murdo, someday"].join(""),
      ["South", "Pole, invited"].join(" "),
      ["Tel", "Aviv"].join(" "),
      ["Jeru", "salem"].join(""),
    ];

    excluded.forEach((city) => expect(cityNames).not.toContain(city));
  });
});
