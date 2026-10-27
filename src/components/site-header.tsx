import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { APP_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-subtle">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2">
        <Link href="/" className="text-lg font-semibold tracking-tight text-fg">
          {APP_NAME}
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
