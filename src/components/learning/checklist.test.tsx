import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import type { LearningItem } from "@/lib/db/schema";
import { Checklist } from "./checklist";

vi.mock("@/app/learning/actions", () => ({
  toggleItemAction: vi.fn(),
  deleteItemAction: vi.fn(),
}));

afterEach(cleanup);

function item(overrides: Partial<LearningItem>): LearningItem {
  const now = new Date();
  return {
    id: 1,
    topicId: 1,
    title: "Item",
    url: null,
    done: false,
    position: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

test("shows an empty message when there are no items", () => {
  render(<Checklist items={[]} />);

  expect(screen.getByText(/Este tema aún está vacío/)).toBeDefined();
});

test("each check button sends the opposite of the current value", () => {
  render(
    <Checklist
      items={[
        item({ id: 1, title: "Dockerfile", done: false }),
        item({ id: 2, title: "Volúmenes", done: true }),
      ]}
    />,
  );

  const pending = screen.getByRole("button", { name: "Aprendido: Dockerfile" });
  expect(pending.getAttribute("aria-pressed")).toBe("false");
  expect(pending.getAttribute("name")).toBe("done");
  expect(pending.getAttribute("value")).toBe("true");

  const learned = screen.getByRole("button", { name: "Aprendido: Volúmenes" });
  expect(learned.getAttribute("aria-pressed")).toBe("true");
  expect(learned.getAttribute("value")).toBe("false");
});

test("links open in a new tab without access to this page, showing the host", () => {
  render(<Checklist items={[item({ url: "https://www.docker.com/get-started/" })]} />);

  const link = screen.getByRole("link", { name: "docker.com" });
  expect(link.getAttribute("href")).toBe("https://www.docker.com/get-started/");
  expect(link.getAttribute("target")).toBe("_blank");
  expect(link.getAttribute("rel")).toBe("noopener noreferrer");
});

test("has a labelled delete button per item", () => {
  render(<Checklist items={[item({ title: "Redes" })]} />);

  expect(screen.getByRole("button", { name: 'Eliminar "Redes"' })).toBeDefined();
});
