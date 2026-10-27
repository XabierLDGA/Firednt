import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <p className="text-sm font-medium text-fg-tertiary">Error 404</p>
      <h1 className="text-xl font-semibold tracking-tight">
        Esta página no existe
      </h1>
      <Link
        href="/"
        className="rounded-sm px-2 py-1 text-base font-medium text-fg-secondary underline underline-offset-4 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
