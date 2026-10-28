import { describe, expect, test } from "vitest";
import { TASK_DESCRIPTION_MAX, TASK_TITLE_MAX } from "./constants";
import { parseTaskForm, parseTaskStatus } from "./validation";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("parseTaskForm", () => {
  test("accepts valid input, trimming text and nulling an empty description", () => {
    const result = parseTaskForm(
      form({ title: "  Escribir tests  ", description: "  ", status: "DOING" }),
    );

    expect(result).toEqual({
      success: true,
      data: { title: "Escribir tests", description: null, status: "DOING" },
    });
  });

  test("defaults to TODO with no description when only a title is sent", () => {
    const result = parseTaskForm(form({ title: "Rápida" }));

    expect(result).toEqual({
      success: true,
      data: { title: "Rápida", description: null, status: "TODO" },
    });
  });

  test("keeps a non-empty description", () => {
    const result = parseTaskForm(form({ title: "T", description: " Notas ", status: "TODO" }));

    expect(result.success && result.data.description).toBe("Notas");
  });

  test("rejects a blank title and returns the submitted values", () => {
    const result = parseTaskForm(form({ title: "   ", description: "x", status: "DONE" }));

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.title).toEqual(["El título es obligatorio."]);
    expect(result.values).toEqual({ title: "   ", description: "x", status: "DONE" });
  });

  test("rejects a missing title field", () => {
    const result = parseTaskForm(form({ status: "TODO" }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.title).toBeDefined();
  });

  test("rejects titles and descriptions that are too long", () => {
    const result = parseTaskForm(
      form({
        title: "a".repeat(TASK_TITLE_MAX + 1),
        description: "b".repeat(TASK_DESCRIPTION_MAX + 1),
        status: "TODO",
      }),
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.title).toEqual([`Máximo ${TASK_TITLE_MAX} caracteres.`]);
    expect(result.errors.description).toEqual([`Máximo ${TASK_DESCRIPTION_MAX} caracteres.`]);
  });

  test("accepts a title at the maximum length", () => {
    const result = parseTaskForm(form({ title: "a".repeat(TASK_TITLE_MAX), status: "TODO" }));

    expect(result.success).toBe(true);
  });

  test.each(["", "LOQUESEA", "todo"])("rejects the status %j when it is sent", (status) => {
    const result = parseTaskForm(form({ title: "T", status }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.status).toEqual(["Elige un estado válido."]);
  });
});

describe("parseTaskStatus", () => {
  test.each(["TODO", "DOING", "DONE"])("accepts %s", (status) => {
    expect(parseTaskStatus(form({ status }))).toMatchObject({ success: true, data: status });
  });

  test.each<Record<string, string>>([{ status: "" }, { status: "LOQUESEA" }, {}])(
    "rejects %j",
    (values) => {
      expect(parseTaskStatus(form(values)).success).toBe(false);
    },
  );
});
