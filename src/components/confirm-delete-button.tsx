"use client";

import { IconTrash } from "@/components/icons";
import { buttonStyles, compactButtonStyles } from "@/components/ui";

type ConfirmDeleteButtonProps = {
  action: () => Promise<void>;
  confirmMessage: string;
  label: string;
  // "icon" shows only a trash icon (with `label` as its accessible name),
  // for rows in a list.
  variant?: "button" | "icon";
};

// Submits the delete action only after the browser's confirmation dialog.
export function ConfirmDeleteButton({
  action,
  confirmMessage,
  label,
  variant = "button",
}: ConfirmDeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {variant === "icon" ? (
        <button
          type="submit"
          aria-label={label}
          title={label}
          className={`${compactButtonStyles} hover:text-danger`}
        >
          <IconTrash size={14} />
        </button>
      ) : (
        <button type="submit" className={buttonStyles.danger}>
          {label}
        </button>
      )}
    </form>
  );
}
