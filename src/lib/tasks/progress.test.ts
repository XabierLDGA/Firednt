import { describe, expect, test } from "vitest";
import type { TaskStatus } from "@/lib/db/enums";
import { calculateProgress, progressFromCounts } from "./progress";

function tasks(...statuses: TaskStatus[]) {
  return statuses.map((status) => ({ status }));
}

describe("calculateProgress", () => {
  test("returns null when there are no tasks", () => {
    expect(calculateProgress([])).toBeNull();
  });

  test("is 0 % when no task is done", () => {
    expect(calculateProgress(tasks("TODO", "DOING"))).toEqual({
      done: 0,
      total: 2,
      percent: 0,
    });
  });

  test("is 100 % when every task is done", () => {
    expect(calculateProgress(tasks("DONE", "DONE", "DONE"))).toEqual({
      done: 3,
      total: 3,
      percent: 100,
    });
  });

  test("only counts DONE tasks as done", () => {
    expect(calculateProgress(tasks("DONE", "DOING", "TODO", "DONE"))).toMatchObject({
      done: 2,
      total: 4,
      percent: 50,
    });
  });

  test.each([
    [1, 3, 33],
    [2, 3, 67],
    [1, 6, 17],
  ])("rounds %i of %i to %i %%", (done, total, percent) => {
    expect(progressFromCounts(done, total)?.percent).toBe(percent);
  });

  test("never shows 100 % while a task is pending", () => {
    expect(progressFromCounts(199, 200)?.percent).toBe(99);
  });

  test("never shows 0 % once a task is done", () => {
    expect(progressFromCounts(1, 300)?.percent).toBe(1);
  });
});
