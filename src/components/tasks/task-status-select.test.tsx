import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { TaskStatusSelect } from "./task-status-select";

test("shows the current status and submits a new one on change", async () => {
  const action = vi.fn(async (formData: FormData) => {
    void formData;
  });
  render(<TaskStatusSelect action={action} status="TODO" taskTitle="Escribir tests" />);

  const select = screen.getByRole("combobox", { name: 'Estado de "Escribir tests"' });
  expect(select).toHaveProperty("value", "TODO");

  fireEvent.change(select, { target: { value: "DONE" } });

  await waitFor(() => expect(action).toHaveBeenCalledOnce());
  expect(action.mock.calls[0][0].get("status")).toBe("DONE");
});
