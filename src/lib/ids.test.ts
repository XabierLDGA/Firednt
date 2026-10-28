import { expect, test } from "vitest";
import { parseId } from "./ids";

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
])("parseId(%j) -> %j", (raw, expected) => {
  expect(parseId(raw)).toBe(expected);
});
