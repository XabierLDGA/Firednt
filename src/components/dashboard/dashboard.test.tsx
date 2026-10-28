import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import type { DashboardStats } from "@/lib/dashboard/stats";
import type { Project } from "@/lib/db/schema";
import { Dashboard } from "./dashboard";

// Vitest globals are off, so Testing Library does not unmount between tests.
afterEach(cleanup);

function project(id: number, name: string): Project {
  const date = new Date(0);
  return {
    id,
    name,
    description: null,
    status: "IN_PROGRESS",
    createdAt: date,
    updatedAt: date,
  };
}

const empty: DashboardStats = {
  projects: { total: 0, byStatus: { IDEA: 0, IN_PROGRESS: 0, PAUSED: 0, DONE: 0 } },
  tasks: { total: 0, byStatus: { TODO: 0, DOING: 0, DONE: 0 } },
  inProgress: [],
};

const stats: DashboardStats = {
  projects: { total: 4, byStatus: { IDEA: 1, IN_PROGRESS: 2, PAUSED: 1, DONE: 0 } },
  tasks: { total: 7, byStatus: { TODO: 3, DOING: 1, DONE: 3 } },
  inProgress: [
    { project: project(1, "firedn't"), progress: { done: 3, total: 6, percent: 50 } },
    { project: project(2, "Recién empezado"), progress: null },
  ],
};

test("welcomes the user when there are no projects yet", () => {
  render(<Dashboard stats={empty} />);

  expect(screen.getByRole("heading", { level: 1, name: "firedn't" })).toBeDefined();
  expect(
    screen.getByRole("link", { name: "Crear tu primer proyecto" }).getAttribute("href"),
  ).toBe("/projects/new");
});

test("shows totals and counts per status", () => {
  render(<Dashboard stats={stats} />);

  const projects = within(screen.getByRole("region", { name: "Proyectos" }));
  expect(projects.getByText("4")).toBeDefined();
  expect(projects.getByText("En desarrollo").nextSibling?.textContent).toBe("2");
  expect(projects.getByText("Terminado").nextSibling?.textContent).toBe("0");

  const tasks = within(screen.getByRole("region", { name: "Tareas" }));
  expect(tasks.getByText("7")).toBeDefined();
  expect(tasks.getByText("Pendiente").nextSibling?.textContent).toBe("3");
  expect(tasks.getByText("Hecha").nextSibling?.textContent).toBe("3");
});

test("links each in-progress project to its page, with its progress", () => {
  render(<Dashboard stats={stats} />);

  const list = within(screen.getByRole("region", { name: "En desarrollo" }));
  const firednt = list.getByRole("link", { name: /firedn't/ });
  expect(firednt.getAttribute("href")).toBe("/projects/1");
  expect(within(firednt).getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50");
  const fresh = list.getByRole("link", { name: /Recién empezado/ });
  expect(fresh.getAttribute("href")).toBe("/projects/2");
  expect(within(fresh).getByText("Sin tareas")).toBeDefined();
});
