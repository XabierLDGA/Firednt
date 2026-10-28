import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { ProgressBar } from "./progress-bar";

// Vitest globals are off, so Testing Library does not unmount between tests.
afterEach(cleanup);

test("shows 'Sin tareas' and no bar when there is no progress", () => {
  render(<ProgressBar progress={null} />);

  expect(screen.getByText("Sin tareas")).toBeDefined();
  expect(screen.queryByRole("progressbar")).toBeNull();
});

test("shows the bar with its value and percent", () => {
  render(<ProgressBar progress={{ done: 4, total: 6, percent: 67 }} />);

  const bar = screen.getByRole("progressbar", { name: "Progreso" });
  expect(bar.getAttribute("aria-valuenow")).toBe("67");
  expect(screen.getByText("67 %")).toBeDefined();
  expect(bar.getAttribute("aria-valuetext")).toBe("67 %, 4 de 6 tareas hechas");
});

test("uses custom labels for other kinds of items", () => {
  const { rerender } = render(<ProgressBar progress={null} emptyLabel="Sin elementos" />);
  expect(screen.getByText("Sin elementos")).toBeDefined();

  rerender(
    <ProgressBar progress={{ done: 1, total: 4, percent: 25 }} doneLabel="aprendidos" />,
  );
  expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe(
    "25 %, 1 de 4 aprendidos",
  );
});
