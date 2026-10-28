"use client";

import { buttonStyles } from "@/components/ui";

type ConfirmDeleteButtonProps = {
  action: () => Promise<void>;
  confirmMessage: string;
  label: string;
};

// Submits the delete action only after the browser's confirmation dialog.
export function ConfirmDeleteButton({ action, confirmMessage, label }: ConfirmDeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <button type="submit" className={buttonStyles.danger}>
        {label}
      </button>
    </form>
  );
}
