import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

test("home page renders the project name", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { level: 1, name: "firedn't" }),
  ).toBeDefined();
});
