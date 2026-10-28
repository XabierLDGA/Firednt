import { expect, test } from "vitest";
import { colorForName, TAG_COLORS } from "./colors";

test("gives the same color to the same name", () => {
  expect(colorForName("firedn't")).toBe(colorForName("firedn't"));
});

test("always returns a palette color other than gray", () => {
  for (const name of ["", "a", "Portfolio personal", "App de recetas", "ñandú 🚀"]) {
    const color = colorForName(name);
    expect(TAG_COLORS).toContain(color);
    expect(color).not.toBe("gray");
  }
});
