// Project pages read the local database on every request. Allowing them to
// block, instead of streaming each data read behind <Suspense>, keeps them
// simple; the local SQLite reads are fast.
export const instant = false;

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return children;
}
