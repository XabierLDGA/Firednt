import { deleteItemAction, toggleItemAction } from "@/app/learning/actions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { IconCheck, IconExternalLink } from "@/components/icons";
import type { LearningItem } from "@/lib/db/schema";

// Each check is a plain form button that sends the new value, so it works
// with the keyboard and without JavaScript.
export function Checklist({ items }: { items: LearningItem[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line px-4 py-8 text-center text-fg-tertiary">
        Este tema aún está vacío. Apunta arriba lo primero que quieras investigar.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-md border border-line">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2 hover:bg-subtle">
          <form action={toggleItemAction.bind(null, item.id)} className="flex">
            <button
              type="submit"
              name="done"
              value={String(!item.done)}
              aria-pressed={item.done}
              aria-label={`Aprendido: ${item.title}`}
              title={item.done ? "Marcar como pendiente" : "Marcar como aprendido"}
              className={`flex size-5 items-center justify-center rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                item.done
                  ? "border-tag-green-fg bg-tag-green-fg text-white"
                  : "border-line-strong bg-page text-transparent hover:border-tag-green-fg hover:text-tag-green-fg"
              }`}
            >
              <IconCheck size={14} />
            </button>
          </form>

          <p
            className={`min-w-0 flex-1 wrap-break-word ${item.done ? "text-fg-tertiary line-through" : "text-fg"}`}
          >
            {item.title}
          </p>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-6 max-w-48 items-center gap-1 rounded-sm px-1.5 text-sm text-fg-tertiary hover:bg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              <IconExternalLink size={14} />
              <span className="truncate">{hostname(item.url)}</span>
            </a>
          )}

          <ConfirmDeleteButton
            action={deleteItemAction.bind(null, item.id)}
            confirmMessage={`¿Eliminar "${item.title}"?`}
            label={`Eliminar "${item.title}"`}
            variant="icon"
          />
        </li>
      ))}
    </ul>
  );
}

// "https://docs.docker.com/compose/" -> "docs.docker.com"
function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
