import Link from "next/link";
import { buttonStyles } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <span className="rounded-sm bg-tag-gray px-1.5 text-sm font-medium text-tag-gray-fg">
        Error 404
      </span>
      <h1 className="text-xl font-semibold tracking-tight">Esta página no existe</h1>
      <p className="text-fg-secondary">Puede que el proyecto o la tarea se hayan eliminado.</p>
      <Link href="/" className={buttonStyles.secondary}>
        Volver al dashboard
      </Link>
    </main>
  );
}
