import { describe, expect, test } from "vitest";
import { ITEM_TITLE_MAX, TOPIC_NAME_MAX } from "./constants";
import { parseItemDone, parseItemForm, parseTopicForm } from "./validation";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("parseTopicForm", () => {
  test("accepts a name, trimming it and nulling an empty description", () => {
    expect(parseTopicForm(form({ name: "  Docker  ", description: "  " }))).toEqual({
      success: true,
      data: { name: "Docker", description: null },
    });
  });

  test("rejects a blank or too long name and returns the submitted values", () => {
    const blank = parseTopicForm(form({ name: "  ", description: "Notas" }));
    expect(blank).toMatchObject({
      success: false,
      errors: { name: ["El nombre es obligatorio."] },
      values: { name: "  ", description: "Notas" },
    });

    const long = parseTopicForm(form({ name: "a".repeat(TOPIC_NAME_MAX + 1) }));
    expect(long.success).toBe(false);
  });
});

describe("parseItemForm", () => {
  test("accepts a title without a link", () => {
    expect(parseItemForm(form({ title: " Volúmenes ", url: "  " }))).toEqual({
      success: true,
      data: { title: "Volúmenes", url: null },
    });
  });

  test("works when the url field is missing", () => {
    expect(parseItemForm(form({ title: "Redes" }))).toEqual({
      success: true,
      data: { title: "Redes", url: null },
    });
  });

  test.each(["https://docs.docker.com/get-started/", "http://localhost:3000/notas"])(
    "accepts the link %s",
    (url) => {
      const result = parseItemForm(form({ title: "Docs", url }));
      expect(result.success && result.data.url).toBe(url);
    },
  );

  test.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "ftp://example.com/file",
    "docs.docker.com",
  ])("rejects the link %s", (url) => {
    const result = parseItemForm(form({ title: "Docs", url }));
    expect(result).toMatchObject({
      success: false,
      errors: { url: ["Escribe un enlace válido (https://…)."] },
      values: { title: "Docs", url },
    });
  });

  test("rejects a blank or too long title", () => {
    expect(parseItemForm(form({ title: " " })).success).toBe(false);
    expect(parseItemForm(form({ title: "a".repeat(ITEM_TITLE_MAX + 1) })).success).toBe(false);
  });
});

describe("parseItemDone", () => {
  test("parses true and false", () => {
    expect(parseItemDone(form({ done: "true" }))).toMatchObject({ success: true, data: true });
    expect(parseItemDone(form({ done: "false" }))).toMatchObject({ success: true, data: false });
  });

  test.each<Record<string, string>>([{}, { done: "yes" }, { done: "" }])("rejects %o", (values) => {
    expect(parseItemDone(form(values)).success).toBe(false);
  });
});
