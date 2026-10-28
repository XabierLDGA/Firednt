// Shared class names for buttons and form controls, built on the design tokens.

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const buttonBase = `inline-flex h-8 items-center justify-center gap-1.5 rounded-sm px-2.5 text-base font-medium whitespace-nowrap transition-colors disabled:opacity-50 ${focus}`;

export const buttonStyles = {
  primary: `${buttonBase} bg-accent text-white hover:bg-accent-hover`,
  secondary: `${buttonBase} border border-line bg-page text-fg-secondary hover:bg-muted hover:text-fg`,
  danger: `${buttonBase} border border-line bg-page text-danger hover:bg-muted`,
};

export const inputStyles = `w-full rounded-sm border border-line bg-page px-2 py-1.5 text-base text-fg placeholder:text-fg-tertiary hover:border-line-strong aria-invalid:border-danger ${focus}`;

// Small borderless button for actions inside cards and list rows.
export const compactButtonStyles = `inline-flex h-6 items-center gap-1 rounded-sm px-1.5 text-sm text-fg-tertiary hover:bg-muted hover:text-fg ${focus}`;

// Small inline select, for lists where a full-width control would be too big.
export const compactSelectStyles = `h-6 cursor-pointer rounded-sm border-0 px-1.5 text-sm font-medium ${focus}`;
