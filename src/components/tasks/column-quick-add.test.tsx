import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { ColumnQuickAdd } from "./column-quick-add";

// Vitest globals are off, so Testing Library does not unmount between tests.
afterEach(cleanup);

test("opens a title input and creates the task in the column's status", async () => {
  const action = vi.fn(async (state: object, formData: FormData) => {
    void formData;
    return state;
  });
  render(<ColumnQuickAdd action={action} status="DOING" />);

  fireEvent.click(screen.getByRole("button", { name: "Nuevo" }));
  const input = screen.getByRole("textbox", { name: "Nueva tarea" });
  fireEvent.change(input, { target: { value: "Revisar el PR" } });
  fireEvent.click(screen.getByRole("button", { name: "Añadir" }));

  await waitFor(() => expect(action).toHaveBeenCalledOnce());
  const formData = action.mock.calls[0][1];
  expect(formData.get("title")).toBe("Revisar el PR");
  expect(formData.get("status")).toBe("DOING");
});

test("Escape closes the input", () => {
  render(<ColumnQuickAdd action={vi.fn(async () => ({}))} status="TODO" />);

  fireEvent.click(screen.getByRole("button", { name: "Nuevo" }));
  fireEvent.keyDown(screen.getByRole("textbox", { name: "Nueva tarea" }), { key: "Escape" });

  expect(screen.queryByRole("textbox")).toBeNull();
  expect(screen.getByRole("button", { name: "Nuevo" })).toBeDefined();
});
