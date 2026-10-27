export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">firednt</h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Un sitio sencillo donde ver todos tus proyectos y el estado de cada uno.
      </p>
      <span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-500 dark:border-zinc-700">
        En construcción
      </span>
    </main>
  );
}
