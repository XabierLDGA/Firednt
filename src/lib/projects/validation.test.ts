import { describe, expect, test } from "vitest";
import { PROJECT_DESCRIPTION_MAX, PROJECT_NAME_MAX } from "./constants";
import { parseProjectForm, parseProjectId } from "./validation";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("parseProjectForm", () => {
  test("accepts valid input, trimming text and nulling an empty description", () => {
    const result = parseProjectForm(
      form({ name: "  firedn't  ", description: "   ", status: "IN_PROGRESS" }),
    );

    expect(result).toEqual({
      success: true,
      data: { name: "firedn't", description: null, status: "IN_PROGRESS" },
    });
  });

  test("keeps a non-empty description", () => {
    const result = parseProjectForm(
      form({ name: "App", description: " Notas ", status: "IDEA" }),
    );

    expect(result.success && result.data.description).toBe("Notas");
  });

  test("rejects a blank name and returns the submitted values", () => {
    const result = parseProjectForm(form({ name: "   ", description: "", status: "IDEA" }));

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.name).toEqual(["El nombre es obligatorio."]);
    expect(result.values).toEqual({ name: "   ", description: "", status: "IDEA" });
  });

  test("rejects a missing name field", () => {
    const result = parseProjectForm(form({ status: "IDEA" }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.name).toBeDefined();
  });

  test("rejects names and descriptions that are too long", () => {
    const result = parseProjectForm(
      form({
        name: "a".repeat(PROJECT_NAME_MAX + 1),
        description: "b".repeat(PROJECT_DESCRIPTION_MAX + 1),
        status: "IDEA",
      }),
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.name).toEqual([`Máximo ${PROJECT_NAME_MAX} caracteres.`]);
    expect(result.errors.description).toEqual([
      `Máximo ${PROJECT_DESCRIPTION_MAX} caracteres.`,
    ]);
  });

  test("accepts names at the maximum length", () => {
    const result = parseProjectForm(
      form({ name: "a".repeat(PROJECT_NAME_MAX), description: "", status: "DONE" }),
    );

    expect(result.success).toBe(true);
  });

  test("rejects an unknown status", () => {
    const result = parseProjectForm(form({ name: "App", description: "", status: "LOQUESEA" }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.status).toEqual(["Elige un estado válido."]);
  });
});

describe("parseProjectId", () => {
  test.each([
    ["1", 1],
    ["42", 42],
    ["0", null],
    ["-1", null],
    ["01", null],
    ["1.5", null],
    ["abc", null],
    ["", null],
    ["99999999999999999999", null],
  ])("parseProjectId(%j) -> %j", (raw, expected) => {
    expect(parseProjectId(raw)).toBe(expected);
  });
});
