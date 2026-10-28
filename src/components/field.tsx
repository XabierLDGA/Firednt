// Label, control and error message for a form field. The control should set
// aria-describedby={`${htmlFor}-error`} when there are errors.
export function Field({
  label,
  htmlFor,
  hint,
  errors,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg-secondary">
        {label}
        {hint && <span className="ml-1 font-normal text-fg-tertiary">· {hint}</span>}
      </label>
      {children}
      {errors && (
        <p id={`${htmlFor}-error`} className="text-sm text-danger">
          {errors.join(" ")}
        </p>
      )}
    </div>
  );
}
