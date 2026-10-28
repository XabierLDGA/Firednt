import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { ProjectProgress } from "./project-progress";

// Vitest globals are off, so Testing Library does not unmount between tests.
afterEach(cleanup);

test("shows 'Sin tareas' and no bar when there is no progress", () => {
  render(<ProjectProgress progress={null} />);

  expect(screen.getByText("Sin tareas")).toBeDefined();
  expect(screen.queryByRole("progressbar")).toBeNull();
});

test("shows the bar with its value and the done/total text", () => {
  render(<ProjectProgress progress={{ done: 4, total: 6, percent: 67 }} />);

  const bar = screen.getByRole("progressbar", { name: "Progreso" });
  expect(bar.getAttribute("aria-valuenow")).toBe("67");
  expect(screen.getByText("4/6 · 67 %")).toBeDefined();
});
