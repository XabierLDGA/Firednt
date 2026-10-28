// Like the project pages: read the local database on every request and
// block instead of streaming each read behind <Suspense>. Pages that read
// data also set it (see app/projects/layout.tsx).
export const instant = false;

export default function LearningLayout({ children }: LayoutProps<"/learning">) {
  return children;
}
