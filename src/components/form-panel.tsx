// Layout for form screens: the form in a bordered panel and, optionally,
// a "danger zone" panel below it for deleting the record.
export function FormPanel({
  children,
  danger,
}: {
  children: React.ReactNode;
  danger?: { title: string; description: string; action: React.ReactNode };
}) {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="max-w-xl rounded-md border border-line bg-page p-5">{children}</div>
      {danger && (
        <section className="max-w-xl rounded-md border border-tag-red bg-page p-5">
          <h2 className="font-medium text-fg">{danger.title}</h2>
          <p className="mt-1 mb-4 text-sm text-fg-secondary">{danger.description}</p>
          {danger.action}
        </section>
      )}
    </div>
  );
}
