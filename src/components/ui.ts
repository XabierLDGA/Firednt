// Shared class names for buttons and form controls, built on the design tokens.

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const buttonBase = `inline-flex items-center justify-center gap-1 rounded-sm px-3 py-1.5 text-base font-medium transition-colors disabled:opacity-50 ${focus}`;

export const buttonStyles = {
  primary: `${buttonBase} bg-fg text-page hover:opacity-90`,
  secondary: `${buttonBase} border border-line bg-page text-fg hover:bg-muted`,
  danger: `${buttonBase} border border-line bg-page text-danger hover:bg-muted`,
};

export const inputStyles = `w-full rounded-sm border border-line bg-page px-2 py-1.5 text-base text-fg placeholder:text-fg-tertiary aria-invalid:border-danger ${focus}`;

// Small inline select, for lists where a full-width control would be too big.
export const compactSelectStyles = `rounded-sm border border-line bg-page px-1.5 py-0.5 text-sm text-fg-secondary hover:bg-muted ${focus}`;
