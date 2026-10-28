import { describe, expect, test } from "vitest";
import type { Task } from "@/lib/db/schema";
import { groupTasksByStatus, neighborStatuses } from "./board";

function task(id: number, status: Task["status"]): Task {
  const date = new Date(0);
  return {
    id,
    projectId: 1,
    title: `Task ${id}`,
    description: null,
    status,
    position: id,
    createdAt: date,
    updatedAt: date,
  };
}

describe("groupTasksByStatus", () => {
  test("puts each task in its column, keeping the input order", () => {
    const columns = groupTasksByStatus([
      task(1, "DONE"),
      task(2, "TODO"),
      task(3, "DONE"),
      task(4, "DOING"),
    ]);

    expect(Object.keys(columns)).toEqual(["TODO", "DOING", "DONE"]);
    expect(columns.TODO.map((t) => t.id)).toEqual([2]);
    expect(columns.DOING.map((t) => t.id)).toEqual([4]);
    expect(columns.DONE.map((t) => t.id)).toEqual([1, 3]);
  });

  test("returns empty columns when there are no tasks", () => {
    expect(groupTasksByStatus([])).toEqual({ TODO: [], DOING: [], DONE: [] });
  });
});

describe("neighborStatuses", () => {
  test.each([
    ["TODO", { previous: undefined, next: "DOING" }],
    ["DOING", { previous: "TODO", next: "DONE" }],
    ["DONE", { previous: "DOING", next: undefined }],
  ] as const)("%s -> %j", (status, expected) => {
    expect(neighborStatuses(status)).toEqual(expected);
  });
});
