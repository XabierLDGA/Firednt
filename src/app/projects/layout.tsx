// Project pages read the local database on every request. Allowing them to
// block, instead of streaming each data read behind <Suspense>, keeps them
// simple; the local SQLite reads are fast.
// Here it covers navigations into /projects from other sections. Moving
// between pages of this section shares this layout, so Next.js validates
// each page on its own: every page that reads data also sets it.
export const instant = false;

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return children;
}
