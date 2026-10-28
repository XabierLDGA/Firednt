"use client";

import { buttonStyles } from "@/components/ui";

type DeleteProjectButtonProps = {
  action: () => Promise<void>;
  projectName: string;
};

export function DeleteProjectButton({ action, projectName }: DeleteProjectButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `¿Eliminar "${projectName}" y todas sus tareas? Esta acción no se puede deshacer.`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <button type="submit" className={buttonStyles.danger}>
        Eliminar proyecto
      </button>
    </form>
  );
}
