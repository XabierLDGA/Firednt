import Link from "next/link";

type Crumb = { label: string; href: string };

type PageProps = {
  icon: React.ReactNode;
  title: string;
  // Parent pages shown before the title: "Proyectos / firedn't".
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
};

// Every screen: a top bar with icon, breadcrumb title and actions, then the content.
export function Page({ icon, title, crumbs = [], actions, children }: PageProps) {
  return (
    <>
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-2">
        <div className="flex min-w-0 items-center gap-1.5 text-fg">
          <span className="text-fg-secondary">{icon}</span>
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex min-w-0 items-center gap-1.5">
              <Link
                href={crumb.href}
                className="truncate rounded-sm text-fg-secondary hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
              >
                {crumb.label}
              </Link>
              <span aria-hidden className="text-fg-tertiary">
                /
              </span>
            </span>
          ))}
          <h1 className="truncate font-medium">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </>
  );
}
