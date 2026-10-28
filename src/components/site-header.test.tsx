import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

afterEach(cleanup);

describe("SiteHeader", () => {
  test("renders the main navigation links", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<SiteHeader />);

    const nav = screen.getByRole("navigation", { name: "Principal" });
    expect(nav).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Dashboard" }).getAttribute("href"),
    ).toBe("/");
    expect(
      screen.getByRole("link", { name: "Proyectos" }).getAttribute("href"),
    ).toBe("/projects");
    expect(
      screen.getByRole("link", { name: "Aprendizaje" }).getAttribute("href"),
    ).toBe("/learning");
    expect(
      screen.getByRole("link", { name: "Copia de seguridad" }).getAttribute("href"),
    ).toBe("/backup");
  });

  test("marks the current section with aria-current", () => {
    vi.mocked(usePathname).mockReturnValue("/projects");
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: "Proyectos" }).getAttribute("aria-current"),
    ).toBe("page");
    expect(
      screen.getByRole("link", { name: "Dashboard" }).getAttribute("aria-current"),
    ).toBeNull();
  });
});
