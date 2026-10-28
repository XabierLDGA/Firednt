"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBriefcase, IconDashboard, IconSchool } from "@/components/icons";
import { TAG_CLASSES } from "@/components/tag";
import type { TagColor } from "@/lib/colors";

const links: { href: string; label: string; Icon: typeof IconDashboard; color: TagColor }[] = [
  { href: "/", label: "Dashboard", Icon: IconDashboard, color: "gray" },
  { href: "/projects", label: "Proyectos", Icon: IconBriefcase, color: "orange" },
  { href: "/learning", label: "Aprendizaje", Icon: IconSchool, color: "green" },
];

// "/" only matches itself; other sections also match their subpages
// (e.g. /projects/123 keeps "Proyectos" active).
export function isActivePath(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal">
      <ul className="flex gap-1 md:flex-col md:gap-0.5">
        {links.map(({ href, label, Icon, color }) => {
          const active = isActivePath(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-sm px-1.5 py-1 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "bg-active text-fg"
                    : "text-fg-secondary hover:bg-muted hover:text-fg"
                }`}
              >
                <span
                  className={`flex size-5 items-center justify-center rounded-sm ${TAG_CLASSES[color]}`}
                >
                  <Icon size={14} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
