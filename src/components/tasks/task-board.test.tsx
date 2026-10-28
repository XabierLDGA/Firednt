import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import type { Task } from "@/lib/db/schema";
import { TaskBoard } from "./task-board";

const { updateTaskStatusAction } = vi.hoisted(() => ({
  updateTaskStatusAction: vi.fn(async (taskId: number, formData: FormData) => {
    void taskId;
    void formData;
  }),
}));

vi.mock("@/app/projects/task-actions", () => ({ updateTaskStatusAction }));

// Vitest globals are off, so Testing Library does not unmount between tests.
afterEach(cleanup);

function task(id: number, title: string, status: Task["status"]): Task {
  const date = new Date(0);
  return {
    id,
    projectId: 1,
    title,
    description: null,
    status,
    position: id,
    createdAt: date,
    updatedAt: date,
  };
}

const tasks = [
  task(1, "Diseñar", "TODO"),
  task(2, "Programar", "DOING"),
  task(3, "Publicar", "DONE"),
];

test("shows each task in the column of its status", () => {
  render(<TaskBoard tasks={tasks} />);

  for (const [column, title] of [
    ["Pendiente", "Diseñar"],
    ["En curso", "Programar"],
    ["Hecha", "Publicar"],
  ]) {
    const section = screen.getByRole("region", { name: new RegExp(`^${column}`) });
    expect(within(section).getByRole("link", { name: title })).toBeDefined();
  }
});

test("offers only the moves that exist for each column", () => {
  render(<TaskBoard tasks={tasks} />);

  const buttons = screen.getAllByRole("button").map((button) => button.getAttribute("aria-label"));
  expect(buttons).toEqual([
    'Mover "Diseñar" a En curso',
    'Mover "Programar" a Pendiente',
    'Mover "Programar" a Hecha',
    'Mover "Publicar" a En curso',
  ]);
});

test("clicking a move button sends the new status for that task", async () => {
  render(<TaskBoard tasks={tasks} />);

  fireEvent.click(screen.getByRole("button", { name: 'Mover "Programar" a Hecha' }));

  await waitFor(() => expect(updateTaskStatusAction).toHaveBeenCalledOnce());
  const [taskId, formData] = updateTaskStatusAction.mock.calls[0];
  expect(taskId).toBe(2);
  expect(formData.get("status")).toBe("DONE");
});
