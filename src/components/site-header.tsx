import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { APP_NAME } from "@/lib/site";

// Sidebar on wide screens, top bar on phones.
export function SiteHeader() {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2 md:sticky md:top-0 md:h-screen md:w-56 md:flex-col md:flex-nowrap md:items-stretch md:justify-start md:gap-5 md:border-b-0 md:py-3">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-sm px-1.5 py-1 text-fg hover:bg-muted focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span
          aria-hidden
          className="flex size-5 items-center justify-center rounded-sm bg-fg text-xs font-semibold text-page"
        >
          f
        </span>
        <span className="text-base font-semibold tracking-tight">{APP_NAME}</span>
      </Link>
      <MainNav />
    </header>
  );
}
