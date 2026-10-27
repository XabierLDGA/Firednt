import { APP_NAME } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="max-w-md text-lg text-fg-secondary">
        Un sitio sencillo donde ver todos tus proyectos y el estado de cada uno.
      </p>
      <span className="rounded-sm border border-line px-2 py-0.5 text-sm text-fg-tertiary">
        En construcción
      </span>
    </main>
  );
}
