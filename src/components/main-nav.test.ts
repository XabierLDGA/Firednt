import { expect, test } from "vitest";
import { isActivePath } from "./main-nav";

test.each([
  ["/", "/", true],
  ["/", "/projects", false],
  ["/projects", "/projects", true],
  ["/projects", "/projects/123", true],
  ["/projects", "/projectsx", false],
  ["/projects", "/", false],
  ["/learning", "/learning/7/edit", true],
  ["/learning", "/projects", false],
])("isActivePath(%s, %s) -> %s", (href, pathname, expected) => {
  expect(isActivePath(href, pathname)).toBe(expected);
});
