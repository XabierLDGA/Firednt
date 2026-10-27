import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
};

// Placeholder until project management lands (#7).
export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Proyectos</h1>
      <p className="mt-2 text-fg-secondary">Próximamente.</p>
    </main>
  );
}
