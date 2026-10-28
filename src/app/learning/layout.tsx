// Like the project pages: read the local database on every request and
// block instead of streaming each read behind <Suspense>.
export const instant = false;

export default function LearningLayout({ children }: LayoutProps<"/learning">) {
  return children;
}
